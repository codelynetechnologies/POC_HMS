using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace HMS.PatientRegistration.Api.Authorization;

public sealed class OptionalAuthRequirementHandler : AuthorizationHandler<IAuthorizationRequirement>
{
    private readonly IConfiguration _configuration;

    public OptionalAuthRequirementHandler(IConfiguration configuration) => _configuration = configuration;

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IAuthorizationRequirement requirement)
    {
        if (!_configuration.GetValue("Security:RequireAuth", false))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        if (context.User.Identity?.IsAuthenticated != true)
        {
            return Task.CompletedTask;
        }

        if (requirement is RolesAuthorizationRequirement rolesReq)
        {
            var userRoles = context.User.Claims
                .Where(c => c.Type == System.Security.Claims.ClaimTypes.Role)
                .Select(c => c.Value);
            if (rolesReq.AllowedRoles.Any(r => userRoles.Contains(r)))
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }

        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}
