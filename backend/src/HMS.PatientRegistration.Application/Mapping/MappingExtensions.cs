using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Domain.Entities;

namespace HMS.PatientRegistration.Application.Mapping;

/// <summary>
/// Manual entity &lt;-&gt; DTO mapping. Kept explicit (no third-party mapper) so the
/// transformations are transparent and dependency-free.
/// </summary>
public static class MappingExtensions
{
    public static AddressDto ToDto(this Address e) => new()
    {
        PhoneCountryCode = e.PhoneCountryCode,
        StdCode = e.StdCode,
        PhoneNumber = e.PhoneNumber,
        AddressLine = e.AddressLine,
        CountryCode = e.CountryCode,
        CountryName = e.CountryName,
        StateCode = e.StateCode,
        StateName = e.StateName,
        CityCode = e.CityCode,
        CityName = e.CityName,
        AreaCode = e.AreaCode,
        AreaName = e.AreaName,
        Pincode = e.Pincode
    };

    public static Address ToEntity(this AddressDto d) => new()
    {
        PhoneCountryCode = d.PhoneCountryCode,
        StdCode = d.StdCode,
        PhoneNumber = d.PhoneNumber,
        AddressLine = d.AddressLine,
        CountryCode = d.CountryCode,
        CountryName = d.CountryName,
        StateCode = d.StateCode,
        StateName = d.StateName,
        CityCode = d.CityCode,
        CityName = d.CityName,
        AreaCode = d.AreaCode,
        AreaName = d.AreaName,
        Pincode = d.Pincode
    };

    public static ProfessionalDetailsDto ToDto(this ProfessionalDetails e) => new()
    {
        OccupationCode = e.OccupationCode,
        OccupationName = e.OccupationName,
        CompanyCode = e.CompanyCode,
        CompanyName = e.CompanyName,
        ProfessionCode = e.ProfessionCode,
        ProfessionName = e.ProfessionName,
        IncomeCategoryCode = e.IncomeCategoryCode,
        IncomeCategoryName = e.IncomeCategoryName
    };

    public static ProfessionalDetails ToEntity(this ProfessionalDetailsDto d) => new()
    {
        OccupationCode = d.OccupationCode,
        OccupationName = d.OccupationName,
        CompanyCode = d.CompanyCode,
        CompanyName = d.CompanyName,
        ProfessionCode = d.ProfessionCode,
        ProfessionName = d.ProfessionName,
        IncomeCategoryCode = d.IncomeCategoryCode,
        IncomeCategoryName = d.IncomeCategoryName
    };

    public static AdditionalDetailsDto ToDto(this AdditionalDetails e) => new()
    {
        NationalityCode = e.NationalityCode,
        NationalityName = e.NationalityName,
        WarningAlerts = e.WarningAlerts,
        RaceCode = e.RaceCode,
        RaceName = e.RaceName,
        ReligionCode = e.ReligionCode,
        ReligionName = e.ReligionName,
        PreferredLanguageCode = e.PreferredLanguageCode,
        PreferredLanguageName = e.PreferredLanguageName
    };

    public static AdditionalDetails ToEntity(this AdditionalDetailsDto d) => new()
    {
        NationalityCode = d.NationalityCode,
        NationalityName = d.NationalityName,
        WarningAlerts = d.WarningAlerts,
        RaceCode = d.RaceCode,
        RaceName = d.RaceName,
        ReligionCode = d.ReligionCode,
        ReligionName = d.ReligionName,
        PreferredLanguageCode = d.PreferredLanguageCode,
        PreferredLanguageName = d.PreferredLanguageName
    };

    public static Patient ToEntity(this PatientRegistrationRequestDto d) => new()
    {
        MrNumber = d.MrNumber,
        PatientType = d.PatientType,
        PrefixCode = d.PrefixCode,
        PrefixName = d.PrefixName,
        FirstName = d.FirstName,
        MiddleName = d.MiddleName,
        LastName = d.LastName,
        Gender = d.Gender,
        DateOfBirth = d.DateOfBirth,
        AgeYears = d.AgeYears,
        AgeMonths = d.AgeMonths,
        AgeDays = d.AgeDays,
        MobileCountryCode = d.MobileCountryCode,
        MobileNumber = d.MobileNumber,
        Email = d.Email,
        MaritalStatusCode = d.MaritalStatusCode,
        MaritalStatusName = d.MaritalStatusName,
        BloodGroupCode = d.BloodGroupCode,
        BloodGroupName = d.BloodGroupName,
        CivilId = d.CivilId,
        FamilyName = d.FamilyName,
        AppointmentReference = d.AppointmentReference,
        Address = d.Address.ToEntity(),
        ProfessionalDetails = d.ProfessionalDetails.ToEntity(),
        AdditionalDetails = d.AdditionalDetails.ToEntity()
    };

    public static PatientRegistrationResponseDto ToResponseDto(this Patient e) => new()
    {
        Id = e.Id,
        MrNumber = e.MrNumber,
        PatientType = e.PatientType,
        PrefixCode = e.PrefixCode,
        PrefixName = e.PrefixName,
        FirstName = e.FirstName,
        MiddleName = e.MiddleName,
        LastName = e.LastName,
        Gender = e.Gender,
        DateOfBirth = e.DateOfBirth,
        AgeYears = e.AgeYears,
        AgeMonths = e.AgeMonths,
        AgeDays = e.AgeDays,
        MobileCountryCode = e.MobileCountryCode,
        MobileNumber = e.MobileNumber,
        Email = e.Email,
        MaritalStatusCode = e.MaritalStatusCode,
        MaritalStatusName = e.MaritalStatusName,
        BloodGroupCode = e.BloodGroupCode,
        BloodGroupName = e.BloodGroupName,
        CivilId = e.CivilId,
        FamilyName = e.FamilyName,
        AppointmentReference = e.AppointmentReference,
        Address = e.Address.ToDto(),
        ProfessionalDetails = e.ProfessionalDetails.ToDto(),
        AdditionalDetails = e.AdditionalDetails.ToDto(),
        CreatedOn = e.CreatedOn,
        ModifiedOn = e.ModifiedOn
    };

    public static PatientSearchResultDto ToSearchResultDto(this Patient e) => new()
    {
        Id = e.Id,
        MrNumber = e.MrNumber,
        PatientName = string.Join(" ", new[] { e.FirstName, e.MiddleName, e.LastName }
            .Where(x => !string.IsNullOrWhiteSpace(x))),
        Gender = e.Gender,
        GenderText = e.Gender.ToString(),
        DateOfBirth = e.DateOfBirth,
        MobileNumber = e.MobileNumber,
        CivilId = e.CivilId
    };

    public static DropdownItemDto ToDto(this DropdownItem e) => new()
    {
        Code = e.Code,
        Name = e.Name,
        ParentCode = e.ParentCode
    };
}
