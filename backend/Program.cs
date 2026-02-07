using System.Reflection;
using AspNet.Security.OAuth.Discord;
using backend.Application.Interfaces.GitProviders;
using backend.Application.Interfaces.Jobs;
using backend.Application.Interfaces.Projects;
using backend.Application.Interfaces.Response;
using backend.Application.Services.Response;
using backend.Infrastructure.Extensions;
using backend.Infrastructure.GitProviders;
using backend.Infrastructure.Jobs;
using backend.Infrastructure.Persistence.Context;
using backend.Infrastructure.Persistence.IRepositories;
using backend.Infrastructure.Persistence.Repositories;
using backend.Services.Projects;
using dotenv.net;
using EasyLogging.Extensions;
using EasyLogging.Loggers;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Scalar.AspNetCore;

// Load enviroment variables from .env files
var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
var envFile = environment == "Development" ? ".env.dev" : ".env";

if (File.Exists(envFile))
{
    DotEnv.Load(options: new DotEnvOptions(envFilePaths: [envFile], overwriteExistingVars: true));
    Console.WriteLine($"[INFO] Environment variables loaded from file: {envFile}");
}

var builder = WebApplication.CreateBuilder(args);

// Load appsettings for the application
builder
    .Configuration.SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Add SEQ logging via EasyLogging
builder.AddEasyLogging(options =>
{
    options.ApplicationName = "PortfolioBackend";
    options.EnableConsoleLogging = true;
    options.LogOutputPath = "Logs";
    options.EnableDetailedEnrichment = false;
    options.LogHttpBodies = false;
    options.SeqUrl = builder.Configuration["SEQ_URL"];
    options.SeqApiKey = builder.Configuration["SEQ_API_KEY"];
});

var connectionString = builder.Configuration["DATABASE_URL"];
var hangfireConnectionString = builder.Configuration["HANGFIRE_DATABASE_URL"];

// Allow all CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAnyCorsPolicy",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
    );
});

// Add Database with PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

// Add HangFire for background tasks
builder.Services.AddHangfire(configuration =>
    configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(hangfireConnectionString))
        .AddEasyLoggingHangfire()
);

builder.Services.AddHangfireServer();

// Add scoped services
builder.Services.AddScoped<IResponseService, ResponseService>();
builder.Services.AddScoped<IGitHub, GitHub>();
builder.Services.AddScoped<IGitLab, GitLab>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IBackgroundJobs, BackgroundJobs>();

// Add authentication
builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme; // This adds cookies
        options.DefaultChallengeScheme = DiscordAuthenticationDefaults.AuthenticationScheme; // This sets Discord as auth challenge
    })
    .AddCookie()
    .AddDiscord(options =>
    {
        options.ClientId = builder.Configuration["DISCORD_CLIENT_ID"] ?? string.Empty;
        options.ClientSecret = builder.Configuration["DISCORD_CLIENT_SECRET"] ?? string.Empty;
    });

// Add HTTP Clients
builder.Services.AddHttpClients(builder.Configuration);

// Add Controllers and Scalar Explorer
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add Swagger Generator for Scalar Docs
var assemblyVersion = Assembly.GetExecutingAssembly().GetName().Version?.ToString(3) ?? "1.0.0";
var apiTitle = $"Website Backend";

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Version = $"v{assemblyVersion}",
            Title = apiTitle,
            Description = "API to manage my personal portfolio content.",
            Contact = new OpenApiContact
            {
                Name = "Alejandro Verde",
                Email = "alex@alexdevuwu.com",
                Url = new Uri("https://github.com/AlexDeveloperUwU"),
            },
        }
    );
});

// Build the application
var app = builder.Build();

// Migrate database if needed
try
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    await context.Database.MigrateAsync();
}
catch (Exception ex)
{
    EasyLogger.Error(ex, "An error occurred while migrating the database.");
}

// Enable API explorer if development enviroment is set
if (app.Environment.IsDevelopment())
{
    app.MapSwagger("/openapi/{documentName}.json");

    var scalarTitle = $"{apiTitle} v{assemblyVersion}";

    app.MapScalarApiReference(options =>
    {
        options.Title = scalarTitle;
        options.Theme = ScalarTheme.BluePlanet;
        options.Layout = ScalarLayout.Modern;
        options.HideClientButton = true;
        options.ShowSidebar = true;
        options.OperationTitleSource = OperationTitleSource.Summary;
        options.PersistentAuthentication = false;
        options.HideModels = false;
        options.DocumentDownloadType = DocumentDownloadType.None;
        options.HideTestRequestButton = false;
        options.HideSearch = false;
        options.ShowOperationId = false;
        options.HideDarkModeToggle = false;
        options.Favicon = "favicon.svg";
        options.DefaultFonts = true;
        options.DefaultOpenAllTags = false;
        options.ExpandAllModelSections = false;
        options.ExpandAllResponses = false;
        options.SchemaPropertyOrder = PropertyOrder.Alpha;
        options.OrderRequiredPropertiesFirst = true;
    });

    app.UseHangfireDashboard();
}
// Add HSTS and HTTPS if we are in production mode
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

// Set CORS to use our policy
app.UseCors("AllowAnyCorsPolicy");

// Enable static files
app.UseDefaultFiles();
app.UseStaticFiles();

// Add auth
app.UseAuthentication();
app.UseAuthorization();

// Add middleware for logging
app.UseEasyLoggingMiddleware();

// Map the defined controllers
app.MapControllers();

// Fallback to index.html
app.MapFallbackToFile("index.html");

// Set the recurring job to trigger daily
RecurringJob.AddOrUpdate<IBackgroundJobs>(
    "SyncProjectsJob",
    service => service.SyncProjectsJob(),
    Cron.Daily
);

// Run the application
app.Run();
