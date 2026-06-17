using HMS.PatientRegistration.Domain.Entities;

namespace HMS.PatientRegistration.Domain.Interfaces;

/// <summary>
/// Persistence contract for patient records. Implemented by both the in-memory
/// mock repository and the EF Core SQL Server repository.
/// </summary>
public interface IPatientRegistrationRepository
{
    /// <summary>Insert or update a patient (legacy IUD semantics). Returns the saved patient.</summary>
    Task<Patient> UpsertAsync(Patient patient, CancellationToken cancellationToken = default);

    /// <summary>Search patients by any combination of criteria.</summary>
    Task<IReadOnlyList<Patient>> SearchAsync(
        string? mrNumber,
        string? firstName,
        string? lastName,
        string? mobileNumber,
        string? civilId,
        CancellationToken cancellationToken = default);

    /// <summary>Fetch a single full patient record by its identifier.</summary>
    Task<Patient?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>Fetch a single full patient record by MR number.</summary>
    Task<Patient?> GetByMrNumberAsync(string mrNumber, CancellationToken cancellationToken = default);
}
