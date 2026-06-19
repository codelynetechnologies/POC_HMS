using System.Collections.Concurrent;

namespace HMS.PatientRegistration.Api.Middleware;

/// <summary>Simple in-memory rate limiter per client IP.</summary>
public class RateLimitingMiddleware
{
    private static readonly ConcurrentDictionary<string, (int Count, DateTime WindowStart)> Buckets = new();
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private readonly int _maxRequests;
    private readonly TimeSpan _window;

    public RateLimitingMiddleware(
        RequestDelegate next,
        ILogger<RateLimitingMiddleware> logger,
        IConfiguration configuration)
    {
        _next = next;
        _logger = logger;
        _maxRequests = configuration.GetValue("Security:RateLimit:MaxRequests", 120);
        _window = TimeSpan.FromMinutes(configuration.GetValue("Security:RateLimit:WindowMinutes", 1));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (_maxRequests <= 0)
        {
            await _next(context);
            return;
        }

        var key = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var now = DateTime.UtcNow;

        var bucket = Buckets.AddOrUpdate(
            key,
            _ => (1, now),
            (_, existing) =>
            {
                if (now - existing.WindowStart > _window)
                {
                    return (1, now);
                }
                return (existing.Count + 1, existing.WindowStart);
            });

        if (bucket.Count > _maxRequests)
        {
            _logger.LogWarning("Rate limit exceeded for {Ip}", key);
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.Response.Headers["Retry-After"] = ((int)_window.TotalSeconds).ToString();
            await context.Response.WriteAsJsonAsync(new { success = false, message = "Too many requests." });
            return;
        }

        await _next(context);
    }
}
