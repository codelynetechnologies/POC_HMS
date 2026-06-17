using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HMS.PatientRegistration.Api.Controllers.Legacy;

/// <summary>Legacy-compatible master/dropdown endpoint.</summary>
[ApiController]
[Route("api/CommonDropdown")]
[Produces("application/json")]
[Tags("Legacy - Common Dropdown")]
public class CommonDropdownController : ControllerBase
{
    private readonly IDropdownService _service;

    public CommonDropdownController(IDropdownService service)
    {
        _service = service;
    }

    /// <summary>Legacy dropdown fetch. Supports cascading via ParentCode.</summary>
    [HttpPost("Fetch")]
    public async Task<ActionResult<ApiResponseDto<IReadOnlyList<DropdownItemDto>>>> Fetch(
        [FromBody] DropdownRequestDto request, CancellationToken cancellationToken)
    {
        var items = await _service.GetAsync(request, cancellationToken);
        return Ok(ApiResponseDto<IReadOnlyList<DropdownItemDto>>.Ok(items));
    }
}
