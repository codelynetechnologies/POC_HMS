namespace HMS.PatientRegistration.Application.DTOs;

/// <summary>A single dropdown value/label pair.</summary>
public class DropdownItemDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ParentCode { get; set; }
}
