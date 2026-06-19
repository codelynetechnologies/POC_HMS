using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HMS.PatientRegistration.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DropdownItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ParentCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DropdownItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MrNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PatientType = table.Column<int>(type: "int", nullable: false),
                    PrefixCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrefixName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MiddleName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AgeYears = table.Column<int>(type: "int", nullable: true),
                    AgeMonths = table.Column<int>(type: "int", nullable: true),
                    AgeDays = table.Column<int>(type: "int", nullable: true),
                    MobileCountryCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MobileNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    MaritalStatusCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaritalStatusName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BloodGroupCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BloodGroupName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CivilId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    FamilyName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AppointmentReference = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Address_Id = table.Column<int>(type: "int", nullable: false),
                    Address_PhoneCountryCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_StdCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_AddressLine = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_CountryCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_CountryName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_StateCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_StateName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_CityCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_CityName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_AreaCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_AreaName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address_Pincode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfessionalDetails_Id = table.Column<int>(type: "int", nullable: false),
                    ProfessionalDetails_OccupationCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfessionalDetails_OccupationName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfessionalDetails_CompanyCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfessionalDetails_CompanyName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfessionalDetails_ProfessionCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfessionalDetails_ProfessionName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfessionalDetails_IncomeCategoryCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfessionalDetails_IncomeCategoryName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalDetails_Id = table.Column<int>(type: "int", nullable: false),
                    AdditionalDetails_NationalityCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalDetails_NationalityName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalDetails_WarningAlerts = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalDetails_RaceCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalDetails_RaceName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalDetails_ReligionCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalDetails_ReligionName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalDetails_PreferredLanguageCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalDetails_PreferredLanguageName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DropdownItems_Type_ParentCode",
                table: "DropdownItems",
                columns: new[] { "Type", "ParentCode" });

            migrationBuilder.CreateIndex(
                name: "IX_Patients_MrNumber",
                table: "Patients",
                column: "MrNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DropdownItems");

            migrationBuilder.DropTable(
                name: "Patients");
        }
    }
}
