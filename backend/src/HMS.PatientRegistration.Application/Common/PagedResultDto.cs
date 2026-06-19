namespace HMS.PatientRegistration.Application.Common;

/// <summary>Standard paged API response wrapper.</summary>
public sealed class PagedResultDto<T>
{
    public required IReadOnlyList<T> Items { get; init; }
    public required int TotalCount { get; init; }
    public required int Page { get; init; }
    public required int PageSize { get; init; }
    public int TotalPages { get; init; }
}
