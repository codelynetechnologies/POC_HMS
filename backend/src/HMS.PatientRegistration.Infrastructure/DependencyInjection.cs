using HMS.PatientRegistration.Domain.Interfaces;
using HMS.PatientRegistration.Infrastructure.Persistence;
using HMS.PatientRegistration.Infrastructure.Repositories.Mock;
using HMS.PatientRegistration.Infrastructure.Repositories.Sql;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HMS.PatientRegistration.Infrastructure;

/// <summary>
/// Registers Infrastructure services. The active data source is selected by the
/// "DataMode" configuration value: "Mock" (default, in-memory) or "SqlServer".
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        var dataMode = configuration.GetValue<string>("DataMode") ?? "Mock";

        if (string.Equals(dataMode, "SqlServer", StringComparison.OrdinalIgnoreCase))
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<PatientRegistrationDbContext>(options =>
                options.UseSqlServer(connectionString));

            services.AddScoped<IPatientRegistrationRepository, SqlPatientRegistrationRepository>();
            services.AddScoped<IDropdownRepository, SqlDropdownRepository>();
        }
        else
        {
            services.AddSingleton<IPatientRegistrationRepository, MockPatientRegistrationRepository>();
            services.AddSingleton<IDropdownRepository, MockDropdownRepository>();
        }

        return services;
    }
}
