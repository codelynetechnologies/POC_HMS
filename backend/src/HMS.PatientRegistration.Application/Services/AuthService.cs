using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs.Auth;

using HMS.PatientRegistration.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace HMS.PatientRegistration.Application.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly ITokenGenerator _tokenGenerator;

    public AuthService(IConfiguration configuration, ITokenGenerator tokenGenerator)
    {
        _configuration = configuration;
        _tokenGenerator = tokenGenerator;
    }

    public Task<LoginResponseDto?> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var users = _configuration.GetSection("Auth:Users").Get<List<UserAccountOptions>>() ?? [];
        var account = users.FirstOrDefault(u =>
            string.Equals(u.Username, request.Username, StringComparison.OrdinalIgnoreCase));

        if (account is null || !PasswordHasher.Verify(request.Password, account.PasswordHash))
        {
            return Task.FromResult<LoginResponseDto?>(null);
        }

        return Task.FromResult<LoginResponseDto?>(_tokenGenerator.GenerateToken(account.Username, account.Role));
    }
}
