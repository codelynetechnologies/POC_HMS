namespace HMS.PatientRegistration.Application.DTOs;

/// <summary>Office / professional details payload.</summary>
public class ProfessionalDetailsDto
{
    public string? OccupationCode { get; set; }
    public string? OccupationName { get; set; }
    public string? CompanyCode { get; set; }
    public string? CompanyName { get; set; }
    public string? ProfessionCode { get; set; }
    public string? ProfessionName { get; set; }
    public string? IncomeCategoryCode { get; set; }
    public string? IncomeCategoryName { get; set; }
}
