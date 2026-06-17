using HMS.PatientRegistration.Domain.Entities;
using HMS.PatientRegistration.Domain.Interfaces;
using HMS.PatientRegistration.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.PatientRegistration.Infrastructure.Repositories.Sql;

/// <summary>EF Core / SQL Server dropdown repository used when DataMode = SqlServer.</summary>
public class SqlDropdownRepository : IDropdownRepository
{
    private readonly PatientRegistrationDbContext _db;

    public SqlDropdownRepository(PatientRegistrationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<DropdownItem>> GetByTypeAsync(
        string type, string? parentCode = null, CancellationToken cancellationToken = default)
    {
        var query = _db.DropdownItems.Where(d => d.Type == type);

        if (!string.IsNullOrWhiteSpace(parentCode))
        {
            query = query.Where(d => d.ParentCode == parentCode);
        }

        return await query
            .OrderBy(d => d.SortOrder)
            .ThenBy(d => d.Name)
            .ToListAsync(cancellationToken);
    }
}
