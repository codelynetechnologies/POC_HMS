using FluentValidation;
using FluentValidation.AspNetCore;
using HMS.PatientRegistration.Api.Middleware;
using HMS.PatientRegistration.Application;
using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Infrastructure;
using HMS.PatientRegistration.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "HmsCorsPolicy";

// Listen on the Replit-provided PORT (falls back to 5000 for local dev).
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

// Application + Infrastructure layers (DataMode switch lives in Infrastructure).
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// FluentValidation automatic validation against the Application assembly validators.
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

builder.Services.AddControllers();

// Return validation failures using the standard ApiResponse envelope.
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(kvp => kvp.Value is { Errors.Count: > 0 })
            .SelectMany(kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage))
            .ToArray();

        var response = ApiResponseDto<object>.Fail("Validation failed.", errors);
        return new BadRequestObjectResult(response);
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "HMS Patient Registration API",
        Version = "v1",
        Description = "Patient Registration migration POC. Exposes legacy-compatible and modern REST endpoints."
    });
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Seed the SQL database on first run (no-op in Mock mode).
await DbInitializer.InitializeAsync(app.Services);

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

// Swagger is served under the /api base path so it is reachable through the proxy.
app.UseSwagger(options => options.RouteTemplate = "api/swagger/{documentName}/swagger.json");
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/api/swagger/v1/swagger.json", "HMS Patient Registration API v1");
    options.RoutePrefix = "api/swagger";
});

app.UseCors(CorsPolicy);

// Serve the Angular single-page application (static build copied into wwwroot).
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// Lightweight health check reachable at /api/healthz through the proxy.
app.MapGet("/api/healthz", () => Results.Ok(ApiResponseDto<string>.Ok("healthy")));

// SPA fallback: any non-API, non-file route returns the Angular shell so the
// Angular router can handle client-side navigation. API routes are matched first.
app.MapFallbackToFile("index.html");

app.Run();
