using HMS.PatientRegistration.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HMS.PatientRegistration.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetService<PatientRegistrationDbContext>();
        if (db is null)
        {
            return;
        }

        var pending = await db.Database.GetPendingMigrationsAsync(cancellationToken);
        if (pending.Any())
        {
            await db.Database.MigrateAsync(cancellationToken);
        }
        else if (!await db.Database.CanConnectAsync(cancellationToken))
        {
            await db.Database.EnsureCreatedAsync(cancellationToken);
        }

        if (!await db.DropdownItems.AnyAsync(cancellationToken))
        {
            var dropdowns = SeedData.GetDropdownItems();
            foreach (var item in dropdowns)
            {
                item.Id = 0;
            }
            db.DropdownItems.AddRange(dropdowns);
            await db.SaveChangesAsync(cancellationToken);
        }

        if (!await db.Patients.AnyAsync(cancellationToken))
        {
            var patients = SeedData.GetPatients();
            foreach (var patient in patients)
            {
                patient.Id = 0;
            }
            db.Patients.AddRange(patients);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
