using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HMS.PatientRegistration.Api.Controllers;

/// <summary>Modern RESTful endpoints for master/dropdown data.</summary>
[ApiController]
[Route("api/dropdowns")]
[Produces("application/json")]
[Tags("Dropdowns")]
public class DropdownsController : ControllerBase
{
    private readonly IDropdownService _service;

    public DropdownsController(IDropdownService service)
    {
        _service = service;
    }

    /// <summary>
    /// Fetch a dropdown category by name, optionally cascaded by parent code
    /// (e.g. /api/dropdowns/State?parentCode=IN).
    /// </summary>
    [HttpGet("{type}")]
    public async Task<ActionResult<ApiResponseDto<IReadOnlyList<DropdownItemDto>>>> Get(
        string type, [FromQuery] string? parentCode, CancellationToken cancellationToken)
    {
        var items = await _service.GetAsync(
            new DropdownRequestDto { Type = type, ParentCode = parentCode }, cancellationToken);
        return Ok(ApiResponseDto<IReadOnlyList<DropdownItemDto>>.Ok(items));
    }
}
