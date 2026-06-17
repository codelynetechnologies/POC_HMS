using HMS.PatientRegistration.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HMS.PatientRegistration.Infrastructure.Persistence;

/// <summary>
/// Ensures the SQL Server database exists and is seeded with demo data the first
/// time the app runs in SqlServer mode. No-op in Mock mode (context not registered).
/// </summary>
public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetService<PatientRegistrationDbContext>();
        if (db is null)
        {
            return; // Mock mode — nothing to initialise.
        }

        await db.Database.EnsureCreatedAsync(cancellationToken);

        if (!await db.DropdownItems.AnyAsync(cancellationToken))
        {
            var dropdowns = SeedData.GetDropdownItems();
            foreach (var item in dropdowns)
            {
                item.Id = 0; // let the database assign identities
            }
            db.DropdownItems.AddRange(dropdowns);
            await db.SaveChangesAsync(cancellationToken);
        }

        if (!await db.Patients.AnyAsync(cancellationToken))
        {
            var patients = SeedData.GetPatients();
            foreach (var patient in patients)
            {
                patient.Id = 0; // let the database assign identities
            }
            db.Patients.AddRange(patients);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
