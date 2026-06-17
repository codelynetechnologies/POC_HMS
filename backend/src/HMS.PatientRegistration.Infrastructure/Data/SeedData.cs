using HMS.PatientRegistration.Domain.Entities;
using HMS.PatientRegistration.Domain.Enums;

namespace HMS.PatientRegistration.Infrastructure.Data;

/// <summary>
/// Central source of demo data used by the Mock repositories and to seed an empty
/// SQL Server database. Keeps Mock and SqlServer modes behaviourally identical.
/// </summary>
public static class SeedData
{
    /// <summary>All master/dropdown values, including cascading geography.</summary>
    public static List<DropdownItem> GetDropdownItems()
    {
        var items = new List<DropdownItem>();
        int id = 1;

        void Add(string type, string code, string name, string? parent = null, int sort = 0)
            => items.Add(new DropdownItem
            {
                Id = id++,
                Type = type,
                Code = code,
                Name = name,
                ParentCode = parent,
                SortOrder = sort
            });

        // Prefix / Title
        Add("Prefix", "MR", "Mr.", sort: 1);
        Add("Prefix", "MRS", "Mrs.", sort: 2);
        Add("Prefix", "MS", "Ms.", sort: 3);
        Add("Prefix", "DR", "Dr.", sort: 4);

        // Gender (kept as dropdown for UI even though entity uses enum)
        Add("Gender", "1", "Male", sort: 1);
        Add("Gender", "2", "Female", sort: 2);
        Add("Gender", "3", "Other", sort: 3);

        // Marital status
        Add("MaritalStatus", "SINGLE", "Single", sort: 1);
        Add("MaritalStatus", "MARRIED", "Married", sort: 2);
        Add("MaritalStatus", "DIVORCED", "Divorced", sort: 3);
        Add("MaritalStatus", "WIDOWED", "Widowed", sort: 4);

        // Blood group
        foreach (var (i, bg) in new[] { "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-" }
                     .Select((v, i) => (i, v)))
        {
            Add("BloodGroup", bg, bg, sort: i + 1);
        }

        // Patient type
        Add("PatientType", "1", "New Patient", sort: 1);
        Add("PatientType", "2", "Existing Patient", sort: 2);
        Add("PatientType", "3", "Staff", sort: 3);
        Add("PatientType", "4", "Newborn", sort: 4);

        // Nationality
        Add("Nationality", "IN", "Indian", sort: 1);
        Add("Nationality", "KW", "Kuwaiti", sort: 2);
        Add("Nationality", "US", "American", sort: 3);
        Add("Nationality", "GB", "British", sort: 4);

        // Race
        Add("Race", "ASIAN", "Asian", sort: 1);
        Add("Race", "CAUCASIAN", "Caucasian", sort: 2);
        Add("Race", "AFRICAN", "African", sort: 3);
        Add("Race", "OTHER", "Other", sort: 4);

        // Religion
        Add("Religion", "HINDU", "Hindu", sort: 1);
        Add("Religion", "MUSLIM", "Muslim", sort: 2);
        Add("Religion", "CHRISTIAN", "Christian", sort: 3);
        Add("Religion", "OTHER", "Other", sort: 4);

        // Preferred language
        Add("Language", "EN", "English", sort: 1);
        Add("Language", "HI", "Hindi", sort: 2);
        Add("Language", "AR", "Arabic", sort: 3);

        // Occupation
        Add("Occupation", "ENG", "Engineer", sort: 1);
        Add("Occupation", "TEACH", "Teacher", sort: 2);
        Add("Occupation", "DOC", "Doctor", sort: 3);
        Add("Occupation", "BUS", "Business", sort: 4);

        // Profession
        Add("Profession", "IT", "Information Technology", sort: 1);
        Add("Profession", "EDU", "Education", sort: 2);
        Add("Profession", "HEALTH", "Healthcare", sort: 3);

        // Income category
        Add("IncomeCategory", "LOW", "Below 25,000", sort: 1);
        Add("IncomeCategory", "MID", "25,000 - 75,000", sort: 2);
        Add("IncomeCategory", "HIGH", "Above 75,000", sort: 3);

        // Countries
        Add("Country", "IN", "India", sort: 1);
        Add("Country", "KW", "Kuwait", sort: 2);

        // States (parent = country)
        Add("State", "MH", "Maharashtra", "IN", 1);
        Add("State", "KA", "Karnataka", "IN", 2);
        Add("State", "ASM", "Al Asimah", "KW", 1);

        // Cities (parent = state)
        Add("City", "MUM", "Mumbai", "MH", 1);
        Add("City", "PUN", "Pune", "MH", 2);
        Add("City", "BLR", "Bengaluru", "KA", 1);
        Add("City", "KWC", "Kuwait City", "ASM", 1);

        // Areas (parent = city)
        Add("Area", "AND", "Andheri", "MUM", 1);
        Add("Area", "BAN", "Bandra", "MUM", 2);
        Add("Area", "KOT", "Kothrud", "PUN", 1);
        Add("Area", "WHF", "Whitefield", "BLR", 1);
        Add("Area", "SAL", "Salmiya", "KWC", 1);

        return items;
    }

    /// <summary>Five demo patients covering different genders, types and geography.</summary>
    public static List<Patient> GetPatients()
    {
        return new List<Patient>
        {
            new()
            {
                Id = 1,
                MrNumber = "MR0001",
                PatientType = PatientType.ExistingPatient,
                PrefixCode = "MR", PrefixName = "Mr.",
                FirstName = "Rahul", MiddleName = "Kumar", LastName = "Sharma",
                Gender = Gender.Male,
                DateOfBirth = new DateTime(1988, 5, 12),
                AgeYears = 38, AgeMonths = 1, AgeDays = 5,
                MobileCountryCode = "+91", MobileNumber = "9820012345",
                Email = "rahul.sharma@example.com",
                MaritalStatusCode = "MARRIED", MaritalStatusName = "Married",
                BloodGroupCode = "O+", BloodGroupName = "O+",
                CivilId = "IN8899001", FamilyName = "Sharma",
                AppointmentReference = "APT-1001",
                Address = new Address
                {
                    PhoneCountryCode = "+91", StdCode = "022", PhoneNumber = "26701234",
                    AddressLine = "12 Marine Drive",
                    CountryCode = "IN", CountryName = "India",
                    StateCode = "MH", StateName = "Maharashtra",
                    CityCode = "MUM", CityName = "Mumbai",
                    AreaCode = "AND", AreaName = "Andheri",
                    Pincode = "400053"
                },
                ProfessionalDetails = new ProfessionalDetails
                {
                    OccupationCode = "ENG", OccupationName = "Engineer",
                    CompanyCode = "TCS", CompanyName = "Tata Consultancy Services",
                    ProfessionCode = "IT", ProfessionName = "Information Technology",
                    IncomeCategoryCode = "HIGH", IncomeCategoryName = "Above 75,000"
                },
                AdditionalDetails = new AdditionalDetails
                {
                    NationalityCode = "IN", NationalityName = "Indian",
                    RaceCode = "ASIAN", RaceName = "Asian",
                    ReligionCode = "HINDU", ReligionName = "Hindu",
                    PreferredLanguageCode = "EN", PreferredLanguageName = "English"
                },
                CreatedOn = new DateTime(2025, 1, 10, 9, 0, 0, DateTimeKind.Utc)
            },
            new()
            {
                Id = 2,
                MrNumber = "MR0002",
                PatientType = PatientType.NewPatient,
                PrefixCode = "MRS", PrefixName = "Mrs.",
                FirstName = "Priya", LastName = "Nair",
                Gender = Gender.Female,
                DateOfBirth = new DateTime(1992, 9, 23),
                AgeYears = 33, AgeMonths = 8, AgeDays = 25,
                MobileCountryCode = "+91", MobileNumber = "9845067890",
                Email = "priya.nair@example.com",
                MaritalStatusCode = "SINGLE", MaritalStatusName = "Single",
                BloodGroupCode = "A+", BloodGroupName = "A+",
                CivilId = "IN7711223", FamilyName = "Nair",
                AppointmentReference = "APT-1002",
                Address = new Address
                {
                    AddressLine = "45 MG Road",
                    CountryCode = "IN", CountryName = "India",
                    StateCode = "KA", StateName = "Karnataka",
                    CityCode = "BLR", CityName = "Bengaluru",
                    AreaCode = "WHF", AreaName = "Whitefield",
                    Pincode = "560066"
                },
                ProfessionalDetails = new ProfessionalDetails
                {
                    OccupationCode = "TEACH", OccupationName = "Teacher",
                    ProfessionCode = "EDU", ProfessionName = "Education",
                    IncomeCategoryCode = "MID", IncomeCategoryName = "25,000 - 75,000"
                },
                AdditionalDetails = new AdditionalDetails
                {
                    NationalityCode = "IN", NationalityName = "Indian",
                    RaceCode = "ASIAN", RaceName = "Asian",
                    ReligionCode = "HINDU", ReligionName = "Hindu",
                    PreferredLanguageCode = "EN", PreferredLanguageName = "English"
                },
                CreatedOn = new DateTime(2025, 2, 2, 10, 30, 0, DateTimeKind.Utc)
            },
            new()
            {
                Id = 3,
                MrNumber = "MR0003",
                PatientType = PatientType.ExistingPatient,
                PrefixCode = "MR", PrefixName = "Mr.",
                FirstName = "Ahmed", LastName = "Al-Sabah",
                Gender = Gender.Male,
                DateOfBirth = new DateTime(1979, 3, 3),
                AgeYears = 47, AgeMonths = 3, AgeDays = 14,
                MobileCountryCode = "+965", MobileNumber = "55512345",
                Email = "ahmed.alsabah@example.com",
                MaritalStatusCode = "MARRIED", MaritalStatusName = "Married",
                BloodGroupCode = "B+", BloodGroupName = "B+",
                CivilId = "KW2233445", FamilyName = "Al-Sabah",
                AppointmentReference = "APT-1003",
                Address = new Address
                {
                    AddressLine = "Block 5, Salem Mubarak St",
                    CountryCode = "KW", CountryName = "Kuwait",
                    StateCode = "ASM", StateName = "Al Asimah",
                    CityCode = "KWC", CityName = "Kuwait City",
                    AreaCode = "SAL", AreaName = "Salmiya",
                    Pincode = "20001"
                },
                ProfessionalDetails = new ProfessionalDetails
                {
                    OccupationCode = "BUS", OccupationName = "Business",
                    IncomeCategoryCode = "HIGH", IncomeCategoryName = "Above 75,000"
                },
                AdditionalDetails = new AdditionalDetails
                {
                    NationalityCode = "KW", NationalityName = "Kuwaiti",
                    RaceCode = "OTHER", RaceName = "Other",
                    ReligionCode = "MUSLIM", ReligionName = "Muslim",
                    PreferredLanguageCode = "AR", PreferredLanguageName = "Arabic"
                },
                CreatedOn = new DateTime(2025, 2, 18, 8, 15, 0, DateTimeKind.Utc)
            },
            new()
            {
                Id = 4,
                MrNumber = "MR0004",
                PatientType = PatientType.NewPatient,
                PrefixCode = "MS", PrefixName = "Ms.",
                FirstName = "Sara", MiddleName = "Jane", LastName = "Williams",
                Gender = Gender.Female,
                DateOfBirth = new DateTime(2000, 11, 30),
                AgeYears = 25, AgeMonths = 6, AgeDays = 18,
                MobileCountryCode = "+1", MobileNumber = "2025550143",
                Email = "sara.williams@example.com",
                MaritalStatusCode = "SINGLE", MaritalStatusName = "Single",
                BloodGroupCode = "AB+", BloodGroupName = "AB+",
                CivilId = "US5566778", FamilyName = "Williams",
                AppointmentReference = "APT-1004",
                Address = new Address
                {
                    AddressLine = "78 FC Road",
                    CountryCode = "IN", CountryName = "India",
                    StateCode = "MH", StateName = "Maharashtra",
                    CityCode = "PUN", CityName = "Pune",
                    AreaCode = "KOT", AreaName = "Kothrud",
                    Pincode = "411038"
                },
                ProfessionalDetails = new ProfessionalDetails
                {
                    OccupationCode = "DOC", OccupationName = "Doctor",
                    ProfessionCode = "HEALTH", ProfessionName = "Healthcare",
                    IncomeCategoryCode = "HIGH", IncomeCategoryName = "Above 75,000"
                },
                AdditionalDetails = new AdditionalDetails
                {
                    NationalityCode = "US", NationalityName = "American",
                    RaceCode = "CAUCASIAN", RaceName = "Caucasian",
                    ReligionCode = "CHRISTIAN", ReligionName = "Christian",
                    PreferredLanguageCode = "EN", PreferredLanguageName = "English"
                },
                CreatedOn = new DateTime(2025, 3, 5, 11, 45, 0, DateTimeKind.Utc)
            },
            new()
            {
                Id = 5,
                MrNumber = "MR0005",
                PatientType = PatientType.Staff,
                PrefixCode = "DR", PrefixName = "Dr.",
                FirstName = "Vikram", LastName = "Desai",
                Gender = Gender.Male,
                DateOfBirth = new DateTime(1970, 7, 19),
                AgeYears = 55, AgeMonths = 10, AgeDays = 29,
                MobileCountryCode = "+91", MobileNumber = "9811122233",
                Email = "vikram.desai@example.com",
                MaritalStatusCode = "MARRIED", MaritalStatusName = "Married",
                BloodGroupCode = "O-", BloodGroupName = "O-",
                CivilId = "IN9900112", FamilyName = "Desai",
                AppointmentReference = "APT-1005",
                Address = new Address
                {
                    AddressLine = "9 Linking Road",
                    CountryCode = "IN", CountryName = "India",
                    StateCode = "MH", StateName = "Maharashtra",
                    CityCode = "MUM", CityName = "Mumbai",
                    AreaCode = "BAN", AreaName = "Bandra",
                    Pincode = "400050"
                },
                ProfessionalDetails = new ProfessionalDetails
                {
                    OccupationCode = "DOC", OccupationName = "Doctor",
                    CompanyCode = "HMS", CompanyName = "City Hospital",
                    ProfessionCode = "HEALTH", ProfessionName = "Healthcare",
                    IncomeCategoryCode = "HIGH", IncomeCategoryName = "Above 75,000"
                },
                AdditionalDetails = new AdditionalDetails
                {
                    NationalityCode = "IN", NationalityName = "Indian",
                    RaceCode = "ASIAN", RaceName = "Asian",
                    ReligionCode = "HINDU", ReligionName = "Hindu",
                    PreferredLanguageCode = "HI", PreferredLanguageName = "Hindi"
                },
                CreatedOn = new DateTime(2025, 3, 22, 7, 0, 0, DateTimeKind.Utc)
            }
        };
    }
}
