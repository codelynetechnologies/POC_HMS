namespace HMS.PatientRegistration.Application.Common;

/// <summary>
/// Standard envelope returned by every API endpoint so clients get a consistent shape.
/// </summary>
/// <typeparam name="T">Type of the payload.</typeparam>
public class ApiResponseDto<T>
{
    public bool Success { get; init; }
    public string? Message { get; init; }
    public T? Data { get; init; }
    public IReadOnlyList<string> Errors { get; init; } = Array.Empty<string>();

    public static ApiResponseDto<T> Ok(T data, string? message = null) => new()
    {
        Success = true,
        Message = message,
        Data = data
    };

    public static ApiResponseDto<T> Fail(string message, IReadOnlyList<string>? errors = null) => new()
    {
        Success = false,
        Message = message,
        Errors = errors ?? Array.Empty<string>()
    };
}
