namespace HMS.PatientRegistration.Domain.Common;

/// <summary>Standard audit contract for persisted entities.</summary>
public interface IAuditableEntity
{
    DateTime CreatedOn { get; set; }
    DateTime? ModifiedOn { get; set; }
    string? CreatedBy { get; set; }
    string? ModifiedBy { get; set; }
    bool IsActive { get; set; }
}
