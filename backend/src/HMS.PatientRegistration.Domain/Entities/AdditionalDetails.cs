namespace HMS.PatientRegistration.Domain.Entities;

/// <summary>
/// Optional additional demographics shown under the collapsible section.
/// </summary>
public class AdditionalDetails
{
    public int Id { get; set; }

    public string? NationalityCode { get; set; }
    public string? NationalityName { get; set; }

    public string? WarningAlerts { get; set; }

    public string? RaceCode { get; set; }
    public string? RaceName { get; set; }

    public string? ReligionCode { get; set; }
    public string? ReligionName { get; set; }

    public string? PreferredLanguageCode { get; set; }
    public string? PreferredLanguageName { get; set; }
}
