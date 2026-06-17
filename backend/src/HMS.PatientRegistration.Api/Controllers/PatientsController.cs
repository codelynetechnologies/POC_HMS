using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HMS.PatientRegistration.Api.Controllers;

/// <summary>Modern RESTful endpoints for patient registration.</summary>
[ApiController]
[Route("api/patients")]
[Produces("application/json")]
[Tags("Patients")]
public class PatientsController : ControllerBase
{
    private readonly IPatientRegistrationService _service;

    public PatientsController(IPatientRegistrationService service)
    {
        _service = service;
    }

    /// <summary>Create a new patient or update an existing one when an id is supplied.</summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponseDto<PatientRegistrationResponseDto>>> Save(
        [FromBody] PatientRegistrationRequestDto request, CancellationToken cancellationToken)
    {
        var saved = await _service.SaveAsync(request, cancellationToken);
        return Ok(ApiResponseDto<PatientRegistrationResponseDto>.Ok(saved, "Patient saved successfully."));
    }

    /// <summary>Fetch a full patient record by id.</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponseDto<PatientRegistrationResponseDto>>> GetById(
        int id, CancellationToken cancellationToken)
    {
        var patient = await _service.GetByIdAsync(id, cancellationToken);
        if (patient is null)
        {
            return NotFound(ApiResponseDto<PatientRegistrationResponseDto>.Fail("Patient not found."));
        }
        return Ok(ApiResponseDto<PatientRegistrationResponseDto>.Ok(patient));
    }

    /// <summary>Search patients by criteria.</summary>
    [HttpPost("search")]
    public async Task<ActionResult<ApiResponseDto<IReadOnlyList<PatientSearchResultDto>>>> Search(
        [FromBody] PatientSearchRequestDto request, CancellationToken cancellationToken)
    {
        var results = await _service.SearchAsync(request, cancellationToken);
        return Ok(ApiResponseDto<IReadOnlyList<PatientSearchResultDto>>.Ok(results));
    }
}
