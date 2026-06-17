using FluentValidation;
using HMS.PatientRegistration.Application.DTOs;

namespace HMS.PatientRegistration.Application.Validators;

/// <summary>Validation rules for patient search. At least one criterion is required.</summary>
public class PatientSearchRequestDtoValidator : AbstractValidator<PatientSearchRequestDto>
{
    public PatientSearchRequestDtoValidator()
    {
        RuleFor(x => x)
            .Must(HasAtLeastOneCriterion)
            .WithMessage("Provide at least one search criterion.");
    }

    private static bool HasAtLeastOneCriterion(PatientSearchRequestDto x) =>
        !string.IsNullOrWhiteSpace(x.MrNumber)
        || !string.IsNullOrWhiteSpace(x.FirstName)
        || !string.IsNullOrWhiteSpace(x.LastName)
        || !string.IsNullOrWhiteSpace(x.MobileNumber)
        || !string.IsNullOrWhiteSpace(x.CivilId);
}
