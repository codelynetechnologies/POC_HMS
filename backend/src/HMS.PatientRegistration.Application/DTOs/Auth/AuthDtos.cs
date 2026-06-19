namespace HMS.PatientRegistration.Application.DTOs.Auth;

public class LoginRequestDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public required string AccessToken { get; init; }
    public required string TokenType { get; init; }
    public required int ExpiresInSeconds { get; init; }
    public required string Username { get; init; }
    public required string Role { get; init; }
}

public class UserAccountOptions
{
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "FrontDesk";
}

public class JwtOptions
{
    public const string SectionName = "Jwt";
    public string Issuer { get; set; } = "HMS.PatientRegistration";
    public string Audience { get; set; } = "HMS.Client";
    public string Key { get; set; } = string.Empty;
    public int ExpiryMinutes { get; set; } = 60;
}
