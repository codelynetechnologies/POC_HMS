using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using HMS.PatientRegistration.Api.Authorization;
using HMS.PatientRegistration.Api.Middleware;
using HMS.PatientRegistration.Application;
using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs.Auth;
using HMS.PatientRegistration.Infrastructure;
using HMS.PatientRegistration.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "HmsCorsPolicy";

var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddControllers();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(kvp => kvp.Value is { Errors.Count: > 0 })
            .SelectMany(kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage))
            .ToArray();
        return new BadRequestObjectResult(ApiResponseDto<object>.Fail("Validation failed.", errors));
    };
});

var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
var jwtKey = jwtOptions.Key;
if (string.IsNullOrWhiteSpace(jwtKey))
{
    jwtKey = "HMS-Dev-Secret-Key-Change-In-Production-Min32Chars!";
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        };
    });

builder.Services.AddSingleton<IAuthorizationHandler, OptionalAuthRequirementHandler>();
builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HMS Patient Registration API",
        Version = "v1",
        Description = "Patient Registration API with legacy-compatible endpoints.",
    });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
            },
            Array.Empty<string>()
        },
    });
});

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        }
        else if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
    });
});

var dataMode = builder.Configuration["DataMode"] ?? "Mock";
var healthChecks = builder.Services.AddHealthChecks();
if (string.Equals(dataMode, "SqlServer", StringComparison.OrdinalIgnoreCase))
{
    healthChecks.AddDbContextCheck<PatientRegistrationDbContext>("database");
}

var app = builder.Build();

await DbInitializer.InitializeAsync(app.Services);

app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseMiddleware<RateLimitingMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

var enableSwagger = app.Configuration.GetValue("Security:EnableSwagger", app.Environment.IsDevelopment());
if (enableSwagger)
{
    app.UseSwagger(options => options.RouteTemplate = "api/swagger/{documentName}/swagger.json");
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/api/swagger/v1/swagger.json", "HMS Patient Registration API v1");
        options.RoutePrefix = "api/swagger";
    });
}

app.UseCors(CorsPolicy);

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<AuditLoggingMiddleware>();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();

app.MapHealthChecks("/api/healthz", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var status = report.Status == HealthStatus.Healthy ? "healthy" : "unhealthy";
        var payload = ApiResponseDto<object>.Ok(new
        {
            status,
            checks = report.Entries.ToDictionary(
                e => e.Key,
                e => new { status = e.Value.Status.ToString(), description = e.Value.Description }),
        });
        await context.Response.WriteAsJsonAsync(payload);
    },
});

app.MapGet("/api/metrics", () => Results.Ok(ApiResponseDto<object>.Ok(new
{
    uptimeSeconds = (DateTime.UtcNow - System.Diagnostics.Process.GetCurrentProcess().StartTime.ToUniversalTime()).TotalSeconds,
    environment = app.Environment.EnvironmentName,
    dataMode,
    requireAuth = app.Configuration.GetValue("Security:RequireAuth", false),
})));

app.MapFallbackToFile("index.html");
app.Run();

public partial class Program { }
