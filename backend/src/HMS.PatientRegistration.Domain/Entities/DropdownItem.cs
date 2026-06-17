namespace HMS.PatientRegistration.Domain.Entities;

/// <summary>
/// A single value/label pair belonging to a named dropdown category
/// (e.g. "BloodGroup", "Country"). Parent code supports cascading lookups.
/// </summary>
public class DropdownItem
{
    public int Id { get; set; }

    /// <summary>The dropdown category, e.g. "Country", "State".</summary>
    public string Type { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    /// <summary>Parent code for cascading dropdowns (State.ParentCode = Country.Code).</summary>
    public string? ParentCode { get; set; }

    public int SortOrder { get; set; }
}
