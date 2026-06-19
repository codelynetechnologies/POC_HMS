import { PatientFormBuilderService } from './patient-form-builder.service';

describe('PatientFormBuilderService', () => {
  let service: PatientFormBuilderService;

  beforeEach(() => {
    service = new PatientFormBuilderService();
  });

  it('creates a registration form with required validators', () => {
    const form = service.createRegistrationForm();
    expect(form.get('firstName')?.hasError('required')).toBeTrue();
    expect(form.get('lastName')?.hasError('required')).toBeTrue();
    expect(form.get('mobileNumber')?.hasError('required')).toBeTrue();
  });

  it('provides default reset values', () => {
    const defaults = service.defaultResetValues();
    expect(defaults['patientType']).toBe('1');
    expect(defaults['gender']).toBe('1');
  });
});
