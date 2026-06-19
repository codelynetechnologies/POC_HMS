using HMS.PatientRegistration.Domain.Common;
using HMS.PatientRegistration.Domain.Entities;
using HMS.PatientRegistration.Domain.Interfaces;
using HMS.PatientRegistration.Infrastructure.Data;

namespace HMS.PatientRegistration.Infrastructure.Repositories.Mock;

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
                    if (string.IsNullOrWhiteSpace(patient.MrNumber))
                    {
                        patient.MrNumber = existing.MrNumber;
                    }
                    patient.CreatedOn = existing.CreatedOn;
                    patient.CreatedBy = existing.CreatedBy;
                    Store.Remove(existing);
                    Store.Add(patient);
                    return Task.FromResult(patient);
                }
            }

            var nextId = Store.Count == 0 ? 1 : Store.Max(p => p.Id) + 1;
            patient.Id = nextId;
            if (string.IsNullOrWhiteSpace(patient.MrNumber))
            {
                patient.MrNumber = $"MR{nextId:0000}";
            }
            patient.IsActive = true;
            Store.Add(patient);
            return Task.FromResult(patient);
        }
    }

    public Task<PagedResult<Patient>> SearchAsync(
        string? mrNumber, string? firstName, string? lastName,
        string? mobileNumber, string? civilId,
        int page, int pageSize,
        CancellationToken cancellationToken = default)
    {
        lock (Lock)
        {
            IEnumerable<Patient> query = Store.Where(p => p.IsActive);

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

            var ordered = query.OrderBy(p => p.Id).ToList();
            var totalCount = ordered.Count;

            if (pageSize > 0)
            {
                ordered = ordered.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            }

            return Task.FromResult(new PagedResult<Patient>
            {
                Items = ordered,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
            });
        }
    }

    public Task<Patient?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        lock (Lock)
        {
            return Task.FromResult(Store.FirstOrDefault(p => p.Id == id && p.IsActive));
        }
    }

    public Task<Patient?> GetByMrNumberAsync(string mrNumber, CancellationToken cancellationToken = default)
    {
        lock (Lock)
        {
            return Task.FromResult(
                Store.FirstOrDefault(p =>
                    p.IsActive && string.Equals(p.MrNumber, mrNumber, StringComparison.OrdinalIgnoreCase)));
        }
    }
}
