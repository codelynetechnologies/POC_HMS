using HMS.PatientRegistration.Domain.Enums;

namespace HMS.PatientRegistration.Application.DTOs;

/// <summary>Lightweight projection of a patient for search result grids.</summary>
public class PatientSearchResultDto
{
    public int Id { get; set; }
    public string? MrNumber { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public string GenderText { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string? MobileNumber { get; set; }
    public string? CivilId { get; set; }
}
