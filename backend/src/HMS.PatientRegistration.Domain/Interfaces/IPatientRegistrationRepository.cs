using HMS.PatientRegistration.Domain.Common;
using HMS.PatientRegistration.Domain.Entities;

namespace HMS.PatientRegistration.Domain.Interfaces;

/// <summary>
/// Persistence contract for patient records. Implemented by both the in-memory
/// mock repository and the EF Core SQL Server repository.
/// </summary>
public interface IPatientRegistrationRepository
{
    Task<Patient> UpsertAsync(Patient patient, CancellationToken cancellationToken = default);

    Task<PagedResult<Patient>> SearchAsync(
        string? mrNumber,
        string? firstName,
        string? lastName,
        string? mobileNumber,
        string? civilId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    Task<Patient?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Patient?> GetByMrNumberAsync(string mrNumber, CancellationToken cancellationToken = default);
}
