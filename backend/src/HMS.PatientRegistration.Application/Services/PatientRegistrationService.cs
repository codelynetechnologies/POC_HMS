using HMS.PatientRegistration.Application.Common;
using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Application.Interfaces;
using HMS.PatientRegistration.Application.Mapping;
using HMS.PatientRegistration.Domain.Common;
using HMS.PatientRegistration.Domain.Interfaces;

namespace HMS.PatientRegistration.Application.Services;

public class PatientRegistrationService : IPatientRegistrationService
{
    private readonly IPatientRegistrationRepository _repository;

    public PatientRegistrationService(IPatientRegistrationRepository repository)
    {
        _repository = repository;
    }

    public async Task<PatientRegistrationResponseDto> SaveAsync(
        PatientRegistrationRequestDto request, CancellationToken cancellationToken = default)
    {
        var patient = request.ToEntity();

        if (request.Id.HasValue && request.Id.Value > 0)
        {
            patient.Id = request.Id.Value;
        }

        if (request.DateOfBirth.HasValue)
        {
            var (years, months, days) = AgeCalculator.Calculate(request.DateOfBirth.Value);
            patient.AgeYears = years;
            patient.AgeMonths = months;
            patient.AgeDays = days;
        }

        var saved = await _repository.UpsertAsync(patient, cancellationToken);
        return saved.ToResponseDto();
    }

    public async Task<PagedResultDto<PatientSearchResultDto>> SearchAsync(
        PatientSearchRequestDto request, CancellationToken cancellationToken = default)
    {
        var results = await _repository.SearchAsync(
            request.MrNumber,
            request.FirstName,
            request.LastName,
            request.MobileNumber,
            request.CivilId,
            request.Page,
            request.PageSize,
            cancellationToken);

        return ToPagedDto(results, p => p.ToSearchResultDto());
    }

    public async Task<PatientRegistrationResponseDto?> GetByIdAsync(
        int id, CancellationToken cancellationToken = default)
    {
        var patient = await _repository.GetByIdAsync(id, cancellationToken);
        return patient?.ToResponseDto();
    }

    private static PagedResultDto<TDto> ToPagedDto<TEntity, TDto>(
        PagedResult<TEntity> source, Func<TEntity, TDto> mapper) =>
        new()
        {
            Items = source.Items.Select(mapper).ToList(),
            TotalCount = source.TotalCount,
            Page = source.Page,
            PageSize = source.PageSize,
            TotalPages = source.TotalPages,
        };
}
