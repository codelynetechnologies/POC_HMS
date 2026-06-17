using HMS.PatientRegistration.Application.Common;

namespace HMS.PatientRegistration.Tests;

public class AgeCalculatorTests
{
    [Fact]
    public void Calculate_ReturnsExactYears_OnExactBirthday()
    {
        var asOf = new DateTime(2026, 6, 17);
        var dob = new DateTime(2000, 6, 17);

        var (years, months, days) = AgeCalculator.Calculate(dob, asOf);

        Assert.Equal(26, years);
        Assert.Equal(0, months);
        Assert.Equal(0, days);
    }

    [Fact]
    public void Calculate_HandlesMonthAndDayBorrow()
    {
        var asOf = new DateTime(2026, 3, 1);
        var dob = new DateTime(2000, 5, 15);

        var (years, months, days) = AgeCalculator.Calculate(dob, asOf);

        Assert.Equal(25, years);
        Assert.Equal(9, months);
        Assert.Equal(14, days);
    }

    [Fact]
    public void Calculate_FutureDob_ReturnsZero()
    {
        var asOf = new DateTime(2026, 6, 17);
        var dob = new DateTime(2030, 1, 1);

        var result = AgeCalculator.Calculate(dob, asOf);

        Assert.Equal((0, 0, 0), result);
    }
}
