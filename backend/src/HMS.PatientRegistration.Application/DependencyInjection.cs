using FluentValidation;
using HMS.PatientRegistration.Application.Interfaces;
using HMS.PatientRegistration.Application.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace HMS.PatientRegistration.Application;

/// <summary>Registers Application-layer services (FluentValidation + use cases).</summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddValidatorsFromAssembly(assembly);

        services.AddScoped<IPatientRegistrationService, PatientRegistrationService>();
        services.AddScoped<IDropdownService, DropdownService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
