namespace HMS.PatientRegistration.Domain.Entities;

/// <summary>
/// Residential address of a patient. Country/State/City/Area are stored both as
/// codes (for cascading lookups) and as display text (for legacy compatibility).
/// </summary>
public class Address
{
    public int Id { get; set; }

    public string? PhoneCountryCode { get; set; }
    public string? StdCode { get; set; }
    public string? PhoneNumber { get; set; }

    public string? AddressLine { get; set; }

    public string? CountryCode { get; set; }
    public string? CountryName { get; set; }
    public string? StateCode { get; set; }
    public string? StateName { get; set; }
    public string? CityCode { get; set; }
    public string? CityName { get; set; }
    public string? AreaCode { get; set; }
    public string? AreaName { get; set; }

    public string? Pincode { get; set; }
}
