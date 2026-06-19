import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ageOrDateOfBirthRequired, dateNotInFuture } from '../patient-form.validators';

/** Builds the patient registration reactive form with validators. */
@Injectable({ providedIn: 'root' })
export class PatientFormBuilderService {
  private readonly fb = inject(FormBuilder);

  createRegistrationForm(): FormGroup {
    return this.fb.group(
      {
        patientType: ['1', Validators.required],
        prefixCode: [''],
        appointmentReference: [''],
        firstName: ['', [Validators.required, Validators.maxLength(100)]],
        middleName: [''],
        lastName: ['', [Validators.required, Validators.maxLength(100)]],
        gender: ['1', Validators.required],
        dateOfBirth: ['', dateNotInFuture],
        ageYears: [null as number | null],
        ageMonths: [null as number | null],
        ageDays: [null as number | null],
        mobileCountryCode: ['+91'],
        mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
        email: ['', Validators.email],
        maritalStatusCode: [''],
        bloodGroupCode: [''],
        civilId: [''],
        familyName: [''],
        address: this.fb.group({
          phoneCountryCode: [''],
          stdCode: [''],
          phoneNumber: [''],
          addressLine: [''],
          countryCode: [''],
          stateCode: [''],
          cityCode: [''],
          areaCode: [''],
          pincode: ['', Validators.pattern(/^\d{3,10}$/)],
        }),
        professionalDetails: this.fb.group({
          occupationCode: [''],
          professionCode: [''],
          incomeCategoryCode: [''],
          companyName: [''],
        }),
        additionalDetails: this.fb.group({
          nationalityCode: [''],
          raceCode: [''],
          religionCode: [''],
          preferredLanguageCode: [''],
          warningAlerts: [''],
        }),
      },
      { validators: ageOrDateOfBirthRequired },
    );
  }

  defaultResetValues(): Record<string, unknown> {
    return {
      patientType: '1',
      gender: '1',
      mobileCountryCode: '+91',
      ageYears: null,
      ageMonths: null,
      ageDays: null,
    };
  }
}
