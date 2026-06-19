using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.PatientRegistration.Api.Controllers.Legacy;

[ApiController]
[Route("api/patientregistration")]
[Produces("application/json")]
[Tags("Legacy - Patient Registration")]
[Authorize(Roles = "FrontDesk,Admin")]
public class PatientRegistrationController : ControllerBase
{
    private readonly IPatientRegistrationService _service;

    public PatientRegistrationController(IPatientRegistrationService service) => _service = service;

    [HttpPost("IUD")]
    public async Task<ActionResult<ApiResponseDto<PatientRegistrationResponseDto>>> Iud(
        [FromBody] PatientRegistrationRequestDto request, CancellationToken cancellationToken)
    {
        var saved = await _service.SaveAsync(request, cancellationToken);
        return Ok(ApiResponseDto<PatientRegistrationResponseDto>.Ok(saved, "Patient saved successfully."));
    }

    /// <summary>Legacy search — returns a flat list (backward compatible).</summary>
    [HttpPost("Fetch")]
    public async Task<ActionResult<ApiResponseDto<IReadOnlyList<PatientSearchResultDto>>>> Fetch(
        [FromBody] PatientSearchRequestDto request, CancellationToken cancellationToken)
    {
        request.PageSize = 0;
        var results = await _service.SearchAsync(request, cancellationToken);
        return Ok(ApiResponseDto<IReadOnlyList<PatientSearchResultDto>>.Ok(results.Items));
    }

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

    public class FetchPatientDataRequest
    {
        public int Id { get; set; }
    }
}
