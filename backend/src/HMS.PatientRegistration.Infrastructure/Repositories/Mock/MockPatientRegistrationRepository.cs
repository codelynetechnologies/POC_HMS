using HMS.PatientRegistration.Domain.Entities;
using HMS.PatientRegistration.Domain.Interfaces;
using HMS.PatientRegistration.Infrastructure.Data;

namespace HMS.PatientRegistration.Infrastructure.Repositories.Mock;

/// <summary>
/// In-memory patient repository used when DataMode = Mock. Thread-safe and
/// pre-seeded with demo patients so the app is fully usable without a database.
/// </summary>
public class MockPatientRegistrationRepository : IPatientRegistrationRepository
{
    private static readonly List<Patient> Store = SeedData.GetPatients();
    private static readonly object Lock = new();

    public Task<Patient> UpsertAsync(Patient patient, CancellationToken cancellationToken = default)
    {
        lock (Lock)
        {
            if (patient.Id > 0)
            {
                var existing = Store.FirstOrDefault(p => p.Id == patient.Id);
                if (existing is not null)
                {
                    patient.CreatedOn = existing.CreatedOn;
                    patient.ModifiedOn = DateTime.UtcNow;
                    if (string.IsNullOrWhiteSpace(patient.MrNumber))
                    {
                        patient.MrNumber = existing.MrNumber;
                    }
                    Store.Remove(existing);
                    Store.Add(patient);
                    return Task.FromResult(patient);
                }
            }

            var nextId = Store.Count == 0 ? 1 : Store.Max(p => p.Id) + 1;
            patient.Id = nextId;
            patient.CreatedOn = DateTime.UtcNow;
            patient.ModifiedOn = null;
            if (string.IsNullOrWhiteSpace(patient.MrNumber))
            {
                patient.MrNumber = $"MR{nextId:0000}";
            }
            Store.Add(patient);
            return Task.FromResult(patient);
        }
    }

    public Task<IReadOnlyList<Patient>> SearchAsync(
        string? mrNumber, string? firstName, string? lastName,
        string? mobileNumber, string? civilId, CancellationToken cancellationToken = default)
    {
        lock (Lock)
        {
            IEnumerable<Patient> query = Store;

            if (!string.IsNullOrWhiteSpace(mrNumber))
                query = query.Where(p => (p.MrNumber ?? "").Contains(mrNumber, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrWhiteSpace(firstName))
                query = query.Where(p => p.FirstName.Contains(firstName, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrWhiteSpace(lastName))
                query = query.Where(p => p.LastName.Contains(lastName, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrWhiteSpace(mobileNumber))
                query = query.Where(p => p.MobileNumber.Contains(mobileNumber, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrWhiteSpace(civilId))
                query = query.Where(p => (p.CivilId ?? "").Contains(civilId, StringComparison.OrdinalIgnoreCase));

            IReadOnlyList<Patient> result = query.OrderBy(p => p.Id).ToList();
            return Task.FromResult(result);
        }
    }

    public Task<Patient?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        lock (Lock)
        {
            return Task.FromResult(Store.FirstOrDefault(p => p.Id == id));
        }
    }

    public Task<Patient?> GetByMrNumberAsync(string mrNumber, CancellationToken cancellationToken = default)
    {
        lock (Lock)
        {
            return Task.FromResult(
                Store.FirstOrDefault(p =>
                    string.Equals(p.MrNumber, mrNumber, StringComparison.OrdinalIgnoreCase)));
        }
    }
}
