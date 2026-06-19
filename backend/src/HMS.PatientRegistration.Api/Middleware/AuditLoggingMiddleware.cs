namespace HMS.PatientRegistration.Api.Middleware;

/// <summary>Logs mutating HTTP operations for audit trails.</summary>
public class AuditLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuditLoggingMiddleware> _logger;

    public AuditLoggingMiddleware(RequestDelegate next, ILogger<AuditLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        await _next(context);

        if (!IsMutating(context.Request.Method))
        {
            return;
        }

        var user = context.User.Identity?.IsAuthenticated == true
            ? context.User.Identity?.Name ?? "authenticated"
            : "anonymous";

        _logger.LogInformation(
            "AUDIT {Method} {Path} Status={StatusCode} User={User} CorrelationId={CorrelationId}",
            context.Request.Method,
            context.Request.Path,
            context.Response.StatusCode,
            user,
            context.TraceIdentifier);
    }

    private static bool IsMutating(string method) =>
        method is "POST" or "PUT" or "PATCH" or "DELETE";
}
