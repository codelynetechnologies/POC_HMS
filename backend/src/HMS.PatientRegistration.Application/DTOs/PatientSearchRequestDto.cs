namespace HMS.PatientRegistration.Application.DTOs;

/// <summary>Criteria for searching patients. Any subset of fields may be supplied.</summary>
public class PatientSearchRequestDto
{
    public string? MrNumber { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? MobileNumber { get; set; }
    public string? CivilId { get; set; }
}
