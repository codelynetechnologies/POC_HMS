using HMS.PatientRegistration.Domain.Entities;
using HMS.PatientRegistration.Domain.Interfaces;
using HMS.PatientRegistration.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.PatientRegistration.Infrastructure.Repositories.Sql;

/// <summary>EF Core / SQL Server patient repository used when DataMode = SqlServer.</summary>
public class SqlPatientRegistrationRepository : IPatientRegistrationRepository
{
    private readonly PatientRegistrationDbContext _db;

    public SqlPatientRegistrationRepository(PatientRegistrationDbContext db)
    {
        _db = db;
    }

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
                patient.CreatedOn = existing.CreatedOn;
                patient.ModifiedOn = DateTime.UtcNow;
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
        patient.CreatedOn = DateTime.UtcNow;
        patient.ModifiedOn = null;
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync(cancellationToken);

        if (string.IsNullOrWhiteSpace(patient.MrNumber))
        {
            patient.MrNumber = $"MR{patient.Id:0000}";
            await _db.SaveChangesAsync(cancellationToken);
        }

        return patient;
    }

    public async Task<IReadOnlyList<Patient>> SearchAsync(
        string? mrNumber, string? firstName, string? lastName,
        string? mobileNumber, string? civilId, CancellationToken cancellationToken = default)
    {
        var query = _db.Patients
            .Include(p => p.Address)
            .Include(p => p.ProfessionalDetails)
            .Include(p => p.AdditionalDetails)
            .AsQueryable();

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

        return await query.OrderBy(p => p.Id).ToListAsync(cancellationToken);
    }

    public async Task<Patient?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _db.Patients
            .Include(p => p.Address)
            .Include(p => p.ProfessionalDetails)
            .Include(p => p.AdditionalDetails)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<Patient?> GetByMrNumberAsync(string mrNumber, CancellationToken cancellationToken = default)
    {
        return await _db.Patients
            .Include(p => p.Address)
            .Include(p => p.ProfessionalDetails)
            .Include(p => p.AdditionalDetails)
            .FirstOrDefaultAsync(p => p.MrNumber == mrNumber, cancellationToken);
    }
}
