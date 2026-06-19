using HMS.PatientRegistration.Application.DTOs.Auth;

namespace HMS.PatientRegistration.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
}

public interface ICurrentUserService
{
    string? UserId { get; }
    string? UserName { get; }
    bool IsAuthenticated { get; }
}

public interface ITokenGenerator
{
    LoginResponseDto GenerateToken(string username, string role);
}
