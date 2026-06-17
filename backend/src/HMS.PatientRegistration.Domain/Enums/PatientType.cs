namespace HMS.PatientRegistration.Domain.Enums;

/// <summary>
/// Classifies the kind of patient record being registered.
/// </summary>
public enum PatientType
{
    NewPatient = 1,
    ExistingPatient = 2,
    Staff = 3,
    Newborn = 4
}
