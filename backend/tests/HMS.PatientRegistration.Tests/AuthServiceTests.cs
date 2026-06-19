using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs.Auth;
using HMS.PatientRegistration.Application.Interfaces;
using HMS.PatientRegistration.Application.Services;
using Microsoft.Extensions.Configuration;

namespace HMS.PatientRegistration.Tests;

public class AuthServiceTests
{
    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsToken()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Auth:Users:0:Username"] = "frontdesk",
                ["Auth:Users:0:PasswordHash"] = PasswordHasher.Hash("FrontDesk123!"),
                ["Auth:Users:0:Role"] = "FrontDesk",
            })
            .Build();

        ITokenGenerator tokenGenerator = new FakeTokenGenerator();
        var service = new AuthService(config, tokenGenerator);

        var result = await service.LoginAsync(new LoginRequestDto
        {
            Username = "frontdesk",
            Password = "FrontDesk123!",
        });

        Assert.NotNull(result);
        Assert.Equal("FrontDesk", result!.Role);
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_ReturnsNull()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Auth:Users:0:Username"] = "frontdesk",
                ["Auth:Users:0:PasswordHash"] = PasswordHasher.Hash("FrontDesk123!"),
                ["Auth:Users:0:Role"] = "FrontDesk",
            })
            .Build();

        var service = new AuthService(config, new FakeTokenGenerator());

        var result = await service.LoginAsync(new LoginRequestDto
        {
            Username = "frontdesk",
            Password = "wrong",
        });

        Assert.Null(result);
    }

    private sealed class FakeTokenGenerator : ITokenGenerator
    {
        public LoginResponseDto GenerateToken(string username, string role) => new()
        {
            AccessToken = "test-token",
            TokenType = "Bearer",
            ExpiresInSeconds = 3600,
            Username = username,
            Role = role,
        };
    }
}
