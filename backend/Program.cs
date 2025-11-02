using System.Reflection;
using backend.Extensions;
using backend.Infrastructure.GitProviders;
using backend.Interfaces.GitProviders;
using backend.Interfaces.Response;
using backend.Persistence.Context;
using backend.Services.Response;
using dotenv.net;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
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

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddScoped<IResponseService, ResponseService>();
builder.Services.AddScoped<IGitHub, GitHub>();
builder.Services.AddScoped<IGitLab, GitLab>();

builder.Services.AddHttpClients(builder.Configuration);

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
            Title = apiTitle,
            Description = "API to manage personal portfolio content.",
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
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred while migrating the database.");
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
}
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
