using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HMS.PatientRegistration.Api.Controllers.Legacy;

/// <summary>
/// Legacy-compatible endpoints that mirror the original ASP.NET WebForms/MVC API
/// so existing callers can migrate without changing their request shape.
/// </summary>
[ApiController]
[Route("api/patientregistration")]
[Produces("application/json")]
[Tags("Legacy - Patient Registration")]
public class PatientRegistrationController : ControllerBase
{
    private readonly IPatientRegistrationService _service;

    public PatientRegistrationController(IPatientRegistrationService service)
    {
        _service = service;
    }

    /// <summary>Legacy Insert/Update/Delete entry point. Saves a patient.</summary>
    [HttpPost("IUD")]
    public async Task<ActionResult<ApiResponseDto<PatientRegistrationResponseDto>>> Iud(
        [FromBody] PatientRegistrationRequestDto request, CancellationToken cancellationToken)
    {
        var saved = await _service.SaveAsync(request, cancellationToken);
        return Ok(ApiResponseDto<PatientRegistrationResponseDto>.Ok(saved, "Patient saved successfully."));
    }

    /// <summary>Legacy patient search endpoint.</summary>
    [HttpPost("Fetch")]
    public async Task<ActionResult<ApiResponseDto<IReadOnlyList<PatientSearchResultDto>>>> Fetch(
        [FromBody] PatientSearchRequestDto request, CancellationToken cancellationToken)
    {
        var results = await _service.SearchAsync(request, cancellationToken);
        return Ok(ApiResponseDto<IReadOnlyList<PatientSearchResultDto>>.Ok(results));
    }

    /// <summary>Legacy single-record fetch by patient id.</summary>
    [HttpPost("FetchPatientData")]
    public async Task<ActionResult<ApiResponseDto<PatientRegistrationResponseDto>>> FetchPatientData(
        [FromBody] FetchPatientDataRequest request, CancellationToken cancellationToken)
    {
        var patient = await _service.GetByIdAsync(request.Id, cancellationToken);
        if (patient is null)
        {
            return NotFound(ApiResponseDto<PatientRegistrationResponseDto>.Fail("Patient not found."));
        }
        return Ok(ApiResponseDto<PatientRegistrationResponseDto>.Ok(patient));
    }

    /// <summary>Request body for the legacy FetchPatientData endpoint.</summary>
    public class FetchPatientDataRequest
    {
        public int Id { get; set; }
    }
}
