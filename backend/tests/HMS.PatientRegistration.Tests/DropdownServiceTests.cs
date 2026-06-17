using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Application.Services;
using HMS.PatientRegistration.Infrastructure.Repositories.Mock;

namespace HMS.PatientRegistration.Tests;

public class DropdownServiceTests
{
    private static DropdownService CreateService()
        => new(new MockDropdownRepository());

    [Fact]
    public async Task GetAsync_BloodGroup_ReturnsItems()
    {
        var service = CreateService();

        var items = await service.GetAsync(new DropdownRequestDto { Type = "BloodGroup" });

        Assert.NotEmpty(items);
        Assert.Contains(items, i => i.Code == "O+");
    }

    [Fact]
    public async Task GetAsync_States_CascadeByCountry()
    {
        var service = CreateService();

        var indiaStates = await service.GetAsync(new DropdownRequestDto { Type = "State", ParentCode = "IN" });
        var kuwaitStates = await service.GetAsync(new DropdownRequestDto { Type = "State", ParentCode = "KW" });

        Assert.All(indiaStates, s => Assert.Equal("IN", s.ParentCode));
        Assert.Contains(indiaStates, s => s.Code == "MH");
        Assert.DoesNotContain(indiaStates, s => s.Code == "ASM");
        Assert.Contains(kuwaitStates, s => s.Code == "ASM");
    }

    [Fact]
    public async Task GetAsync_Cities_CascadeByState()
    {
        var service = CreateService();

        var cities = await service.GetAsync(new DropdownRequestDto { Type = "City", ParentCode = "MH" });

        Assert.Contains(cities, c => c.Code == "MUM");
        Assert.Contains(cities, c => c.Code == "PUN");
        Assert.All(cities, c => Assert.Equal("MH", c.ParentCode));
    }
}
