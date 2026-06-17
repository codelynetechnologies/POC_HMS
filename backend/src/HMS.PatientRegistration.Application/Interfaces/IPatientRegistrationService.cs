using HMS.PatientRegistration.Application.DTOs;

namespace HMS.PatientRegistration.Application.Interfaces;

/// <summary>Use cases for the patient registration module.</summary>
public interface IPatientRegistrationService
{
    /// <summary>Insert or update a patient. Returns the saved record.</summary>
    Task<PatientRegistrationResponseDto> SaveAsync(
        PatientRegistrationRequestDto request, CancellationToken cancellationToken = default);

    /// <summary>Search patients by criteria and return grid projections.</summary>
    Task<IReadOnlyList<PatientSearchResultDto>> SearchAsync(
        PatientSearchRequestDto request, CancellationToken cancellationToken = default);

    /// <summary>Fetch a full patient record by id.</summary>
    Task<PatientRegistrationResponseDto?> GetByIdAsync(
        int id, CancellationToken cancellationToken = default);
}
