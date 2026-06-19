using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs;

namespace HMS.PatientRegistration.Application.Interfaces;

public interface IPatientRegistrationService
{
    Task<PatientRegistrationResponseDto> SaveAsync(
        PatientRegistrationRequestDto request, CancellationToken cancellationToken = default);

    Task<PagedResultDto<PatientSearchResultDto>> SearchAsync(
        PatientSearchRequestDto request, CancellationToken cancellationToken = default);

    Task<PatientRegistrationResponseDto?> GetByIdAsync(
        int id, CancellationToken cancellationToken = default);
}
