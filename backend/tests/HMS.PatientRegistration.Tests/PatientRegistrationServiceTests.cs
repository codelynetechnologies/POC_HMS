using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Application.Services;
using HMS.PatientRegistration.Domain.Enums;
using HMS.PatientRegistration.Infrastructure.Repositories.Mock;

namespace HMS.PatientRegistration.Tests;

public class PatientRegistrationServiceTests
{
    private static PatientRegistrationService CreateService()
        => new(new MockPatientRegistrationRepository());

    [Fact]
    public async Task SaveAsync_NewPatient_AssignsIdAndMrNumber()
    {
        var service = CreateService();
        var request = new PatientRegistrationRequestDto
        {
            FirstName = "Test",
            LastName = "User",
            MobileNumber = "9990001111",
            Gender = Gender.Male,
            DateOfBirth = new DateTime(1995, 1, 1)
        };

        var saved = await service.SaveAsync(request);

        Assert.True(saved.Id > 0);
        Assert.False(string.IsNullOrWhiteSpace(saved.MrNumber));
        Assert.True(saved.AgeYears > 0);
    }

    [Fact]
    public async Task SearchAsync_ByFirstName_ReturnsSeededPatient()
    {
        var service = CreateService();

        var results = await service.SearchAsync(new PatientSearchRequestDto { FirstName = "Rahul" });

        Assert.Contains(results, r => r.PatientName.Contains("Rahul"));
    }

    [Fact]
    public async Task GetByIdAsync_ExistingSeed_ReturnsFullRecord()
    {
        var service = CreateService();

        var patient = await service.GetByIdAsync(1);

        Assert.NotNull(patient);
        Assert.Equal("MR0001", patient!.MrNumber);
        Assert.NotNull(patient.Address);
        Assert.Equal("India", patient.Address.CountryName);
    }

    [Fact]
    public async Task GetByIdAsync_Unknown_ReturnsNull()
    {
        var service = CreateService();

        var patient = await service.GetByIdAsync(99999);

        Assert.Null(patient);
    }
}
