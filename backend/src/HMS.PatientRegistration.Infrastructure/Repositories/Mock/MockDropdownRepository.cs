using HMS.PatientRegistration.Domain.Entities;
using HMS.PatientRegistration.Domain.Interfaces;
using HMS.PatientRegistration.Infrastructure.Data;

namespace HMS.PatientRegistration.Infrastructure.Repositories.Mock;

/// <summary>
/// In-memory dropdown repository used when DataMode = Mock. Supports cascading
/// lookups via parent code (Country -> State -> City -> Area).
/// </summary>
public class MockDropdownRepository : IDropdownRepository
{
    private static readonly List<DropdownItem> Store = SeedData.GetDropdownItems();

    public Task<IReadOnlyList<DropdownItem>> GetByTypeAsync(
        string type, string? parentCode = null, CancellationToken cancellationToken = default)
    {
        IEnumerable<DropdownItem> query = Store
            .Where(d => string.Equals(d.Type, type, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(parentCode))
        {
            query = query.Where(d =>
                string.Equals(d.ParentCode, parentCode, StringComparison.OrdinalIgnoreCase));
        }

        IReadOnlyList<DropdownItem> result = query
            .OrderBy(d => d.SortOrder)
            .ThenBy(d => d.Name)
            .ToList();

        return Task.FromResult(result);
    }
}
