using HMS.PatientRegistration.Domain.Enums;

namespace HMS.PatientRegistration.Application.DTOs;

/// <summary>Full patient record returned to the client.</summary>
public class PatientRegistrationResponseDto
{
    public int Id { get; set; }
    public string? MrNumber { get; set; }
    public PatientType PatientType { get; set; }

    public string? PrefixCode { get; set; }
    public string? PrefixName { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? AgeYears { get; set; }
    public int? AgeMonths { get; set; }
    public int? AgeDays { get; set; }
    public string? MobileCountryCode { get; set; }
    public string MobileNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? MaritalStatusCode { get; set; }
    public string? MaritalStatusName { get; set; }
    public string? BloodGroupCode { get; set; }
    public string? BloodGroupName { get; set; }
    public string? CivilId { get; set; }
    public string? FamilyName { get; set; }
    public string? AppointmentReference { get; set; }

    public AddressDto Address { get; set; } = new();
    public ProfessionalDetailsDto ProfessionalDetails { get; set; } = new();
    public AdditionalDetailsDto AdditionalDetails { get; set; } = new();

    public DateTime CreatedOn { get; set; }
    public DateTime? ModifiedOn { get; set; }
}
