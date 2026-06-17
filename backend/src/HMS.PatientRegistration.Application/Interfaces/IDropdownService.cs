using HMS.PatientRegistration.Application.DTOs;

namespace HMS.PatientRegistration.Application.Interfaces;

/// <summary>Use cases for master/dropdown data.</summary>
public interface IDropdownService
{
    /// <summary>Fetch a dropdown category, optionally cascaded by parent code.</summary>
    Task<IReadOnlyList<DropdownItemDto>> GetAsync(
        DropdownRequestDto request, CancellationToken cancellationToken = default);
}
