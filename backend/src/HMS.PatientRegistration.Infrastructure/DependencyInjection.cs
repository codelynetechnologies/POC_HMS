using HMS.PatientRegistration.Application.Interfaces;
using HMS.PatientRegistration.Application.Services;
using HMS.PatientRegistration.Infrastructure.Auth;
using HMS.PatientRegistration.Infrastructure.Persistence;
using HMS.PatientRegistration.Infrastructure.Repositories.Mock;
using HMS.PatientRegistration.Infrastructure.Repositories.Sql;
using HMS.PatientRegistration.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HMS.PatientRegistration.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.Configure<Application.DTOs.Auth.JwtOptions>(
            configuration.GetSection(Application.DTOs.Auth.JwtOptions.SectionName));
        services.AddSingleton<ITokenGenerator, JwtTokenGenerator>();

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
