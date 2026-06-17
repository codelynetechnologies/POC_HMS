using HMS.PatientRegistration.Application.DTOs;
using HMS.PatientRegistration.Application.Interfaces;
using HMS.PatientRegistration.Application.Mapping;
using HMS.PatientRegistration.Domain.Interfaces;

namespace HMS.PatientRegistration.Application.Services;

/// <summary>Serves master/dropdown data, supporting cascading lookups.</summary>
public class DropdownService : IDropdownService
{
    private readonly IDropdownRepository _repository;

    public DropdownService(IDropdownRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<DropdownItemDto>> GetAsync(
        DropdownRequestDto request, CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetByTypeAsync(request.Type, request.ParentCode, cancellationToken);
        return items.Select(i => i.ToDto()).ToList();
    }
}
