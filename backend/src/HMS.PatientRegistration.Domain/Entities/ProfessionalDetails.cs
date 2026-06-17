namespace HMS.PatientRegistration.Domain.Entities;

/// <summary>
/// Office / professional details captured for a patient.
/// </summary>
public class ProfessionalDetails
{
    public int Id { get; set; }

    public string? OccupationCode { get; set; }
    public string? OccupationName { get; set; }

    public string? CompanyCode { get; set; }
    public string? CompanyName { get; set; }

    public string? ProfessionCode { get; set; }
    public string? ProfessionName { get; set; }

    public string? IncomeCategoryCode { get; set; }
    public string? IncomeCategoryName { get; set; }
}
