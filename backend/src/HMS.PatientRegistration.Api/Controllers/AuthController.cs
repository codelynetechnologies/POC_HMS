using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs.Auth;
using HMS.PatientRegistration.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HMS.PatientRegistration.Api.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
[Tags("Authentication")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponseDto<LoginResponseDto>>> Login(
        [FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _authService.LoginAsync(request, cancellationToken);
        if (result is null)
        {
            return Unauthorized(ApiResponseDto<LoginResponseDto>.Fail("Invalid username or password."));
        }

        return Ok(ApiResponseDto<LoginResponseDto>.Ok(result, "Login successful."));
    }
}
