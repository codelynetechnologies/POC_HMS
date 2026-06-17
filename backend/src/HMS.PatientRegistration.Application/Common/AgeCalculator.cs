namespace HMS.PatientRegistration.Application.Common;

/// <summary>Utility to derive age components from a date of birth.</summary>
public static class AgeCalculator
{
    /// <summary>Calculates years, months and days between <paramref name="dob"/> and <paramref name="asOf"/>.</summary>
    public static (int Years, int Months, int Days) Calculate(DateTime dob, DateTime? asOf = null)
    {
        var today = (asOf ?? DateTime.UtcNow).Date;
        var birth = dob.Date;
        if (birth > today)
        {
            return (0, 0, 0);
        }

        int years = today.Year - birth.Year;
        int months = today.Month - birth.Month;
        int days = today.Day - birth.Day;

        if (days < 0)
        {
            months--;
            days += DateTime.DaysInMonth(
                today.Month == 1 ? today.Year - 1 : today.Year,
                today.Month == 1 ? 12 : today.Month - 1);
        }

        if (months < 0)
        {
            years--;
            months += 12;
        }

        return (years, months, days);
    }
}
