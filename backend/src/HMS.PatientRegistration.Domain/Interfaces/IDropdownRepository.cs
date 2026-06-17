using HMS.PatientRegistration.Domain.Entities;

namespace HMS.PatientRegistration.Domain.Interfaces;

/// <summary>
/// Persistence contract for master/dropdown data.
/// </summary>
public interface IDropdownRepository
{
    /// <summary>
    /// Returns all items for a dropdown category, optionally filtered by parent code
    /// to support cascading dropdowns (Country -> State -> City -> Area).
    /// </summary>
    Task<IReadOnlyList<DropdownItem>> GetByTypeAsync(
        string type,
        string? parentCode = null,
        CancellationToken cancellationToken = default);
}
