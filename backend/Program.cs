using System.Reflection;
using AspNet.Security.OAuth.Discord;
using backend.Services.Projects;
using dotenv.net;
using EasyLogging.Extensions;
using EasyLogging.Loggers;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Portfolio.Backend.Application.Interfaces.GitProviders;
using Portfolio.Backend.Application.Interfaces.Jobs;
using Portfolio.Backend.Application.Interfaces.Projects;
using Portfolio.Backend.Application.Interfaces.Repositories;
using Portfolio.Backend.Application.Interfaces.Response;
using Portfolio.Backend.Application.Services.Response;
using Portfolio.Backend.Infrastructure.Extensions;
using Portfolio.Backend.Infrastructure.GitProviders;
using Portfolio.Backend.Infrastructure.Jobs;
using Portfolio.Backend.Infrastructure.Persistence.Context;
using Portfolio.Backend.Infrastructure.Persistence.Repositories;
using Scalar.AspNetCore;

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
var envFile = environment == "Development" ? ".env.dev" : ".env";

if (File.Exists(envFile))
{
    DotEnv.Load(options: new DotEnvOptions(envFilePaths: [envFile], overwriteExistingVars: true));
    Console.WriteLine($"[INFO] Environment variables loaded from file: {envFile}");
}

var builder = WebApplication.CreateBuilder(args);

builder
    .Configuration.SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

builder.AddEasyLogging(options =>
{
    options.ApplicationName = "Portfolio.Backend";
    options.EnableConsoleLogging = true;
    options.LogOutputPath = "Logs";
    options.EnableDetailedEnrichment = false;
    options.LogHttpBodies = false;
    options.SeqUrl = builder.Configuration["SEQ_URL"];
    options.SeqApiKey = builder.Configuration["SEQ_API_KEY"];
});

var connectionString = builder.Configuration["DATABASE_URL"];
var hangfireConnectionString = builder.Configuration["HANGFIRE_DATABASE_URL"];

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

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddHangfire(configuration =>
    configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(hangfireConnectionString))
        .AddEasyLoggingHangfire()
);

builder.Services.AddHangfireServer();

builder.Services.AddScoped<IResponseService, ResponseService>();
builder.Services.AddScoped<IGitHub, GitHub>();
builder.Services.AddScoped<IGitLab, GitLab>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IBackgroundJobs, BackgroundJobs>();

builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = DiscordAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie()
    .AddDiscord(options =>
    {
        options.ClientId = builder.Configuration["DISCORD_CLIENT_ID"] ?? string.Empty;
        options.ClientSecret = builder.Configuration["DISCORD_CLIENT_SECRET"] ?? string.Empty;
        options.CallbackPath = "/api/auth/callback";
    });

builder.Services.AddHttpClients(builder.Configuration);

builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
    options.AppendTrailingSlash = true;
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var assemblyVersion = Assembly.GetExecutingAssembly().GetName().Version?.ToString(3) ?? "1.0.0";
var apiTitle = $"Website Backend";

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Version = $"v{assemblyVersion}",
            Title = $"✨ {apiTitle}",
            Description =
                "This API is the dedicated backbone designed exclusively to power my personal portfolio's features, "
                + "content, and live integrations. \n\n"
                + "⚠️ **Internal Use Only:** This service is not intended for public consumption. "
                + "Access is strictly restricted to the portfolio's frontend and authorized personal integrations. "
                + "Most endpoints require active authentication to ensure system integrity.",
            Contact = new OpenApiContact
            {
                Name = "Alejandro Verde",
                Email = "alex@alexdevuwu.com",
                Url = new Uri("https://github.com/AlexDeveloperUwU"),
            },
        }
    );
});

var app = builder.Build();

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
        options.DocumentDownloadType = DocumentDownloadType.Direct;
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
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseCors("AllowAnyCorsPolicy");
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();
app.UseEasyLoggingMiddleware();
app.MapControllers();
app.MapFallbackToFile("index.html");

RecurringJob.AddOrUpdate<IBackgroundJobs>(
    "SyncProjectsJob",
    service => service.SyncProjectsJob(),
    Cron.Daily
);

app.Run();
