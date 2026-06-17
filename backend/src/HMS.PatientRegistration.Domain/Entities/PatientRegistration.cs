using HMS.PatientRegistration.Domain.Enums;

namespace HMS.PatientRegistration.Domain.Entities;

/// <summary>
/// Aggregate root representing a registered patient. Mirrors the legacy patient
/// master table as closely as possible to ease migration.
/// </summary>
public class Patient
{
    public int Id { get; set; }

    /// <summary>Medical Record Number assigned by the hospital.</summary>
    public string? MrNumber { get; set; }

    public PatientType PatientType { get; set; } = PatientType.NewPatient;

    // Personal details
    public string? PrefixCode { get; set; }
    public string? PrefixName { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = string.Empty;
    public Gender Gender { get; set; } = Gender.Unknown;
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

    /// <summary>Integration-ready reference to an external appointment record.</summary>
    public string? AppointmentReference { get; set; }

    // Owned sub-records
    public Address Address { get; set; } = new();
    public ProfessionalDetails ProfessionalDetails { get; set; } = new();
    public AdditionalDetails AdditionalDetails { get; set; } = new();

    // Audit
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public DateTime? ModifiedOn { get; set; }
}
