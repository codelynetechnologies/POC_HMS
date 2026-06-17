using FluentValidation;
using HMS.PatientRegistration.Application.DTOs;

namespace HMS.PatientRegistration.Application.Validators;

/// <summary>Validation rules for creating/updating a patient.</summary>
public class PatientRegistrationRequestDtoValidator : AbstractValidator<PatientRegistrationRequestDto>
{
    public PatientRegistrationRequestDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(100);

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(100);

        RuleFor(x => x.MobileNumber)
            .NotEmpty().WithMessage("Mobile number is required.")
            .Matches(@"^\d{7,15}$").WithMessage("Mobile number must be 7 to 15 digits.");

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Email is not valid.")
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.Gender)
            .IsInEnum().WithMessage("Gender is not valid.");

        RuleFor(x => x.PatientType)
            .IsInEnum().WithMessage("Patient type is not valid.");

        RuleFor(x => x.DateOfBirth)
            .LessThanOrEqualTo(_ => DateTime.UtcNow.Date)
            .WithMessage("Date of birth cannot be in the future.")
            .When(x => x.DateOfBirth.HasValue);

        RuleFor(x => x)
            .Must(x => x.DateOfBirth.HasValue
                       || (x.AgeYears.HasValue || x.AgeMonths.HasValue || x.AgeDays.HasValue))
            .WithMessage("Either date of birth or age must be provided.");

        RuleFor(x => x.Address.Pincode)
            .Matches(@"^\d{3,10}$")
            .WithMessage("Pincode must be 3 to 10 digits.")
            .When(x => !string.IsNullOrWhiteSpace(x.Address.Pincode));
    }
}
