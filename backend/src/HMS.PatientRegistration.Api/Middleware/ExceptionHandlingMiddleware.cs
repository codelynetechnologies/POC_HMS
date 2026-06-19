using System.Text.Json;
using HMS.PatientRegistration.Application.Common;

namespace HMS.PatientRegistration.Api.Middleware;

/// <summary>
/// Converts unhandled exceptions into a consistent <see cref="ApiResponseDto{T}"/>
/// JSON payload so clients never receive raw stack traces.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception for {Method} {Path}",
                context.Request.Method, context.Request.Path);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var errors = _environment.IsDevelopment()
                ? new[] { ex.Message }
                : Array.Empty<string>();

            var response = ApiResponseDto<object>.Fail(
                "An unexpected error occurred. Please try again later.",
                errors);

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
        }
    }
}
