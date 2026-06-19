using HMS.PatientRegistration.Domain.Common;
using HMS.PatientRegistration.Domain.Entities;
using HMS.PatientRegistration.Domain.Interfaces;
using HMS.PatientRegistration.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.PatientRegistration.Infrastructure.Repositories.Sql;

public class SqlPatientRegistrationRepository : IPatientRegistrationRepository
{
    private readonly PatientRegistrationDbContext _db;

    public SqlPatientRegistrationRepository(PatientRegistrationDbContext db) => _db = db;

    public async Task<Patient> UpsertAsync(Patient patient, CancellationToken cancellationToken = default)
    {
        if (patient.Id > 0)
        {
            var existing = await _db.Patients
                .Include(p => p.Address)
                .Include(p => p.ProfessionalDetails)
                .Include(p => p.AdditionalDetails)
                .FirstOrDefaultAsync(p => p.Id == patient.Id, cancellationToken);

            if (existing is not null)
            {
                if (string.IsNullOrWhiteSpace(patient.MrNumber))
                {
                    patient.MrNumber = existing.MrNumber;
                }
                _db.Entry(existing).CurrentValues.SetValues(patient);
                existing.Address = patient.Address;
                existing.ProfessionalDetails = patient.ProfessionalDetails;
                existing.AdditionalDetails = patient.AdditionalDetails;
                await _db.SaveChangesAsync(cancellationToken);
                return existing;
            }
        }

        patient.Id = 0;
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync(cancellationToken);

        if (string.IsNullOrWhiteSpace(patient.MrNumber))
        {
            patient.MrNumber = $"MR{patient.Id:0000}";
            await _db.SaveChangesAsync(cancellationToken);
        }

        return patient;
    }

    public async Task<PagedResult<Patient>> SearchAsync(
        string? mrNumber, string? firstName, string? lastName,
        string? mobileNumber, string? civilId,
        int page, int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = _db.Patients
            .AsNoTracking()
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(mrNumber))
            query = query.Where(p => p.MrNumber != null && p.MrNumber.Contains(mrNumber));
        if (!string.IsNullOrWhiteSpace(firstName))
            query = query.Where(p => p.FirstName.Contains(firstName));
        if (!string.IsNullOrWhiteSpace(lastName))
            query = query.Where(p => p.LastName.Contains(lastName));
        if (!string.IsNullOrWhiteSpace(mobileNumber))
            query = query.Where(p => p.MobileNumber.Contains(mobileNumber));
        if (!string.IsNullOrWhiteSpace(civilId))
            query = query.Where(p => p.CivilId != null && p.CivilId.Contains(civilId));

        query = query.OrderBy(p => p.Id);

        var totalCount = await query.CountAsync(cancellationToken);

        if (pageSize > 0)
        {
            query = query.Skip((page - 1) * pageSize).Take(pageSize);
        }

        var items = await query.ToListAsync(cancellationToken);

        return new PagedResult<Patient>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    public async Task<Patient?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _db.Patients
            .AsNoTracking()
            .Include(p => p.Address)
            .Include(p => p.ProfessionalDetails)
            .Include(p => p.AdditionalDetails)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive, cancellationToken);
    }

    public async Task<Patient?> GetByMrNumberAsync(string mrNumber, CancellationToken cancellationToken = default)
    {
        return await _db.Patients
            .AsNoTracking()
            .Include(p => p.Address)
            .Include(p => p.ProfessionalDetails)
            .Include(p => p.AdditionalDetails)
            .FirstOrDefaultAsync(p => p.MrNumber == mrNumber && p.IsActive, cancellationToken);
    }
}
