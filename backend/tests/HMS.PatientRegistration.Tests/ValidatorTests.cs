using FluentValidation.TestHelper;
using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Application.Validators;
using HMS.PatientRegistration.Domain.Enums;

namespace HMS.PatientRegistration.Tests;

public class PatientRegistrationRequestDtoValidatorTests
{
    private readonly PatientRegistrationRequestDtoValidator _validator = new();

    private static PatientRegistrationRequestDto ValidRequest() => new()
    {
        FirstName = "Jane",
        LastName = "Doe",
        MobileNumber = "9876543210",
        Gender = Gender.Female,
        DateOfBirth = new DateTime(1990, 5, 15),
        PatientType = PatientType.NewPatient,
        Address = new AddressDto()
    };

    [Fact]
    public void ValidRequest_PassesValidation()
    {
        var result = _validator.TestValidate(ValidRequest());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void MissingFirstName_FailsValidation()
    {
        var request = ValidRequest();
        request.FirstName = "";
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Fact]
    public void InvalidMobileNumber_FailsValidation()
    {
        var request = ValidRequest();
        request.MobileNumber = "abc";
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.MobileNumber);
    }

    [Fact]
    public void MissingDobAndAge_FailsValidation()
    {
        var request = ValidRequest();
        request.DateOfBirth = null;
        request.AgeYears = null;
        request.AgeMonths = null;
        request.AgeDays = null;
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x);
    }

    [Fact]
    public void FutureDateOfBirth_FailsValidation()
    {
        var request = ValidRequest();
        request.DateOfBirth = DateTime.UtcNow.Date.AddDays(1);
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.DateOfBirth);
    }
}

public class DropdownRequestDtoValidatorTests
{
    private readonly DropdownRequestDtoValidator _validator = new();

    [Theory]
    [InlineData("Country")]
    [InlineData("State")]
    [InlineData("BloodGroup")]
    public void SupportedType_PassesValidation(string type)
    {
        var result = _validator.TestValidate(new DropdownRequestDto { Type = type });
        result.ShouldNotHaveValidationErrorFor(x => x.Type);
    }

    [Fact]
    public void UnknownType_FailsValidation()
    {
        var result = _validator.TestValidate(new DropdownRequestDto { Type = "InvalidType" });
        result.ShouldHaveValidationErrorFor(x => x.Type);
    }

    [Fact]
    public void EmptyType_FailsValidation()
    {
        var result = _validator.TestValidate(new DropdownRequestDto { Type = "" });
        result.ShouldHaveValidationErrorFor(x => x.Type);
    }
}
