namespace HMS.PatientRegistration.Application.DTOs;

/// <summary>Request to fetch a dropdown category, optionally cascaded by parent code.</summary>
public class DropdownRequestDto
{
    /// <summary>Category name, e.g. "Country", "State", "BloodGroup".</summary>
    public string Type { get; set; } = string.Empty;

    /// <summary>Parent code for cascading dropdowns (e.g. Country code when fetching States).</summary>
    public string? ParentCode { get; set; }
}
