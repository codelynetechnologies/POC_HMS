using FluentValidation;
using HMS.PatientRegistration.Application.DTOs;

namespace HMS.PatientRegistration.Application.Validators;

/// <summary>Validates dropdown type requests against known master-data categories.</summary>
public class DropdownRequestDtoValidator : AbstractValidator<DropdownRequestDto>
{
    private static readonly HashSet<string> AllowedTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "Prefix", "Gender", "MaritalStatus", "BloodGroup", "PatientType",
        "Nationality", "Race", "Religion", "Language", "Occupation",
        "Profession", "IncomeCategory", "Country", "State", "City", "Area",
    };

    public DropdownRequestDtoValidator()
    {
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Dropdown type is required.")
            .Must(t => AllowedTypes.Contains(t))
            .WithMessage("Dropdown type is not supported.");
    }
}
