import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { DropdownService } from '../../core/services/dropdown.service';
import { PatientService } from '../../core/services/patient.service';
import {
  DropdownItem,
  Gender,
  PatientRegistrationRequest,
  PatientSearchResult,
  PatientType,
} from '../../core/models/patient.models';
import {
  ageOrDateOfBirthRequired,
  computeAge,
  dateNotInFuture,
  nameOf,
} from './patient-form.validators';

import { PersonalDetailsComponent } from './sections/personal-details.component';
import { AdditionalDetailsComponent } from './sections/additional-details.component';
import { ResidentialAddressComponent } from './sections/residential-address.component';
import { ProfessionalDetailsComponent } from './sections/professional-details.component';
import { InsuranceDocumentsComponent } from './sections/insurance-documents.component';
import { PatientSearchModalComponent } from '../../shared/components/patient-search-modal/patient-search-modal.component';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PersonalDetailsComponent,
    AdditionalDetailsComponent,
    ResidentialAddressComponent,
    ProfessionalDetailsComponent,
    InsuranceDocumentsComponent,
    PatientSearchModalComponent,
  ],
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss'],
})
export class PatientRegistrationComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dropdowns = inject(DropdownService);
  private readonly patients = inject(PatientService);
  private readonly destroyRef = inject(DestroyRef);

  // Static master data.
  prefixes: DropdownItem[] = [];
  genders: DropdownItem[] = [];
  maritalStatuses: DropdownItem[] = [];
  bloodGroups: DropdownItem[] = [];
  patientTypes: DropdownItem[] = [];
  nationalities: DropdownItem[] = [];
  races: DropdownItem[] = [];
  religions: DropdownItem[] = [];
  languages: DropdownItem[] = [];
  occupations: DropdownItem[] = [];
  professions: DropdownItem[] = [];
  incomeCategories: DropdownItem[] = [];
  countries: DropdownItem[] = [];

  // Cascading geography.
  states: DropdownItem[] = [];
  cities: DropdownItem[] = [];
  areas: DropdownItem[] = [];

  editingId: number | null = null;
  editingMrNumber: string | null = null;
  saving = false;
  showSearch = false;
  loadingMaster = true;
  successMessage = '';
  errorMessage = '';

  readonly skeletonSections = [0, 1, 2];
  readonly skeletonFields = [0, 1, 2, 3, 4, 5, 6, 7];

  private suppressCascadeReset = false;
  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly form: FormGroup = this.fb.group(
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

  get addressForm(): FormGroup {
    return this.form.get('address') as FormGroup;
  }
  get professionalForm(): FormGroup {
    return this.form.get('professionalDetails') as FormGroup;
  }
  get additionalForm(): FormGroup {
    return this.form.get('additionalDetails') as FormGroup;
  }

  get summaryName(): string {
    const v = this.form.getRawValue();
    const name = [v.firstName, v.middleName, v.lastName]
      .map((p: string) => (p ?? '').trim())
      .filter(Boolean)
      .join(' ');
    return name || 'New Patient';
  }

  get summaryInitials(): string {
    const v = this.form.getRawValue();
    const first = (v.firstName ?? '').trim();
    const last = (v.lastName ?? '').trim();
    const letters = (first[0] ?? '') + (last[0] ?? first[1] ?? '');
    return (letters || 'NP').toUpperCase();
  }

  get typeLabel(): string {
    return nameOf(this.patientTypes, this.form.get('patientType')?.value) ?? '';
  }

  get genderLabel(): string {
    return nameOf(this.genders, this.form.get('gender')?.value) ?? '';
  }

  get bloodLabel(): string {
    return nameOf(this.bloodGroups, this.form.get('bloodGroupCode')?.value) ?? '';
  }

  get ageLabel(): string {
    const v = this.form.getRawValue();
    const parts: string[] = [];
    if (v.ageYears != null && v.ageYears !== '') {
      parts.push(`${v.ageYears}Y`);
    }
    if (v.ageMonths != null && v.ageMonths !== '') {
      parts.push(`${v.ageMonths}M`);
    }
    if (v.ageDays != null && v.ageDays !== '') {
      parts.push(`${v.ageDays}D`);
    }
    return parts.join(' ');
  }

  get warningAlerts(): string {
    return this.form.get('additionalDetails.warningAlerts')?.value ?? '';
  }

  get appointmentRef(): string {
    return this.form.get('appointmentReference')?.value ?? '';
  }

  ngOnInit(): void {
    this.loadMasterData();
    this.wireCascades();
    this.wireAgeFromDob();
    this.destroyRef.onDestroy(() => clearTimeout(this.toastTimer));
  }

  private flash(success: string, error: string): void {
    this.successMessage = success;
    this.errorMessage = error;
    clearTimeout(this.toastTimer);
    if (success || error) {
      this.toastTimer = setTimeout(() => {
        this.successMessage = '';
        this.errorMessage = '';
      }, 5000);
    }
  }

  dismissToast(): void {
    clearTimeout(this.toastTimer);
    this.successMessage = '';
    this.errorMessage = '';
  }

  private loadMasterData(): void {
    forkJoin({
      prefixes: this.dropdowns.get('Prefix'),
      genders: this.dropdowns.get('Gender'),
      maritalStatuses: this.dropdowns.get('MaritalStatus'),
      bloodGroups: this.dropdowns.get('BloodGroup'),
      patientTypes: this.dropdowns.get('PatientType'),
      nationalities: this.dropdowns.get('Nationality'),
      races: this.dropdowns.get('Race'),
      religions: this.dropdowns.get('Religion'),
      languages: this.dropdowns.get('Language'),
      occupations: this.dropdowns.get('Occupation'),
      professions: this.dropdowns.get('Profession'),
      incomeCategories: this.dropdowns.get('IncomeCategory'),
      countries: this.dropdowns.get('Country'),
    }).subscribe({
      next: (data) => {
        Object.assign(this, data);
        this.loadingMaster = false;
      },
      error: (err) => {
        this.loadingMaster = false;
        this.flash('', err?.friendlyMessage ?? 'Failed to load master data.');
      },
    });
  }

  private wireCascades(): void {
    this.addressForm
      .get('countryCode')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((code: string) => {
        this.dropdowns.getCascaded('State', code).subscribe((s) => (this.states = s));
        if (!this.suppressCascadeReset) {
          this.addressForm.patchValue({ stateCode: '', cityCode: '', areaCode: '' });
          this.cities = [];
          this.areas = [];
        }
      });

    this.addressForm
      .get('stateCode')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((code: string) => {
        this.dropdowns.getCascaded('City', code).subscribe((c) => (this.cities = c));
        if (!this.suppressCascadeReset) {
          this.addressForm.patchValue({ cityCode: '', areaCode: '' });
          this.areas = [];
        }
      });

    this.addressForm
      .get('cityCode')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((code: string) => {
        this.dropdowns.getCascaded('Area', code).subscribe((a) => (this.areas = a));
        if (!this.suppressCascadeReset) {
          this.addressForm.patchValue({ areaCode: '' });
        }
      });
  }

  private wireAgeFromDob(): void {
    this.form
      .get('dateOfBirth')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => {
        if (this.suppressCascadeReset || !value) {
          return;
        }
        const age = computeAge(new Date(value));
        if (age) {
          this.form.patchValue(
            { ageYears: age.years, ageMonths: age.months, ageDays: age.days },
            { emitEvent: false },
          );
        }
      });
  }

  openSearch(): void {
    this.showSearch = true;
  }

  onSearchSelect(result: PatientSearchResult): void {
    this.showSearch = false;
    this.loadPatient(result.id);
  }

  private loadPatient(id: number): void {
    this.dismissToast();
    this.patients.getById(id).subscribe({
      next: (patient) => {
        if (!patient) {
          this.flash('', 'Patient could not be loaded.');
          return;
        }
        const addr = patient.address ?? {};
        this.suppressCascadeReset = true;
        forkJoin({
          states: this.dropdowns.getCascaded('State', addr.countryCode),
          cities: this.dropdowns.getCascaded('City', addr.stateCode),
          areas: this.dropdowns.getCascaded('Area', addr.cityCode),
        }).subscribe({
          error: (err) => {
            this.suppressCascadeReset = false;
            this.flash('', err?.friendlyMessage ?? 'Failed to load address details.');
          },
          next: (geo) => {
          this.states = geo.states;
          this.cities = geo.cities;
          this.areas = geo.areas;

          this.editingId = patient.id;
          this.editingMrNumber = patient.mrNumber ?? null;
          this.form.reset();
          this.form.patchValue({
            patientType: String(patient.patientType ?? PatientType.NewPatient),
            prefixCode: patient.prefixCode ?? '',
            appointmentReference: patient.appointmentReference ?? '',
            firstName: patient.firstName,
            middleName: patient.middleName ?? '',
            lastName: patient.lastName,
            gender: String(patient.gender ?? Gender.Unknown),
            dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.slice(0, 10) : '',
            ageYears: patient.ageYears ?? null,
            ageMonths: patient.ageMonths ?? null,
            ageDays: patient.ageDays ?? null,
            mobileCountryCode: patient.mobileCountryCode ?? '',
            mobileNumber: patient.mobileNumber,
            email: patient.email ?? '',
            maritalStatusCode: patient.maritalStatusCode ?? '',
            bloodGroupCode: patient.bloodGroupCode ?? '',
            civilId: patient.civilId ?? '',
            familyName: patient.familyName ?? '',
            address: {
              phoneCountryCode: addr.phoneCountryCode ?? '',
              stdCode: addr.stdCode ?? '',
              phoneNumber: addr.phoneNumber ?? '',
              addressLine: addr.addressLine ?? '',
              countryCode: addr.countryCode ?? '',
              stateCode: addr.stateCode ?? '',
              cityCode: addr.cityCode ?? '',
              areaCode: addr.areaCode ?? '',
              pincode: addr.pincode ?? '',
            },
            professionalDetails: {
              occupationCode: patient.professionalDetails?.occupationCode ?? '',
              professionCode: patient.professionalDetails?.professionCode ?? '',
              incomeCategoryCode: patient.professionalDetails?.incomeCategoryCode ?? '',
              companyName: patient.professionalDetails?.companyName ?? '',
            },
            additionalDetails: {
              nationalityCode: patient.additionalDetails?.nationalityCode ?? '',
              raceCode: patient.additionalDetails?.raceCode ?? '',
              religionCode: patient.additionalDetails?.religionCode ?? '',
              preferredLanguageCode: patient.additionalDetails?.preferredLanguageCode ?? '',
              warningAlerts: patient.additionalDetails?.warningAlerts ?? '',
            },
          });
          this.suppressCascadeReset = false;
          this.flash(`Loaded ${patient.mrNumber} for editing.`, '');
          },
        });
      },
      error: (err) => this.flash('', err?.friendlyMessage ?? 'Patient could not be loaded.'),
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.flash('', 'Please correct the highlighted fields before saving.');
      return;
    }

    this.saving = true;
    this.patients.save(this.buildPayload()).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success && res.data) {
          this.editingId = res.data.id;
          this.editingMrNumber = res.data.mrNumber ?? null;
          this.flash(`${res.message ?? 'Patient saved.'} MR Number: ${res.data.mrNumber}`, '');
          this.form.markAsPristine();
        } else {
          this.flash('', res.errors?.join(' ') || res.message || 'Save failed.');
        }
      },
      error: (err) => {
        this.saving = false;
        this.flash('', err?.friendlyMessage ?? 'Save failed.');
      },
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.editingMrNumber = null;
    this.dismissToast();
    this.states = [];
    this.cities = [];
    this.areas = [];
    this.form.reset({
      patientType: '1',
      gender: '1',
      mobileCountryCode: '+91',
      ageYears: null,
      ageMonths: null,
      ageDays: null,
    });
  }

  private buildPayload(): PatientRegistrationRequest {
    const v = this.form.getRawValue();
    const addr = v.address;
    const prof = v.professionalDetails;
    const add = v.additionalDetails;

    return {
      id: this.editingId,
      mrNumber: this.editingMrNumber,
      patientType: Number(v.patientType) as PatientType,
      prefixCode: v.prefixCode || null,
      prefixName: nameOf(this.prefixes, v.prefixCode),
      firstName: v.firstName,
      middleName: v.middleName || null,
      lastName: v.lastName,
      gender: Number(v.gender) as Gender,
      dateOfBirth: v.dateOfBirth || null,
      ageYears: v.ageYears ?? null,
      ageMonths: v.ageMonths ?? null,
      ageDays: v.ageDays ?? null,
      mobileCountryCode: v.mobileCountryCode || null,
      mobileNumber: v.mobileNumber,
      email: v.email || null,
      maritalStatusCode: v.maritalStatusCode || null,
      maritalStatusName: nameOf(this.maritalStatuses, v.maritalStatusCode),
      bloodGroupCode: v.bloodGroupCode || null,
      bloodGroupName: nameOf(this.bloodGroups, v.bloodGroupCode),
      civilId: v.civilId || null,
      familyName: v.familyName || null,
      appointmentReference: v.appointmentReference || null,
      address: {
        phoneCountryCode: addr.phoneCountryCode || null,
        stdCode: addr.stdCode || null,
        phoneNumber: addr.phoneNumber || null,
        addressLine: addr.addressLine || null,
        countryCode: addr.countryCode || null,
        countryName: nameOf(this.countries, addr.countryCode),
        stateCode: addr.stateCode || null,
        stateName: nameOf(this.states, addr.stateCode),
        cityCode: addr.cityCode || null,
        cityName: nameOf(this.cities, addr.cityCode),
        areaCode: addr.areaCode || null,
        areaName: nameOf(this.areas, addr.areaCode),
        pincode: addr.pincode || null,
      },
      professionalDetails: {
        occupationCode: prof.occupationCode || null,
        occupationName: nameOf(this.occupations, prof.occupationCode),
        companyCode: null,
        companyName: prof.companyName || null,
        professionCode: prof.professionCode || null,
        professionName: nameOf(this.professions, prof.professionCode),
        incomeCategoryCode: prof.incomeCategoryCode || null,
        incomeCategoryName: nameOf(this.incomeCategories, prof.incomeCategoryCode),
      },
      additionalDetails: {
        nationalityCode: add.nationalityCode || null,
        nationalityName: nameOf(this.nationalities, add.nationalityCode),
        warningAlerts: add.warningAlerts || null,
        raceCode: add.raceCode || null,
        raceName: nameOf(this.races, add.raceCode),
        religionCode: add.religionCode || null,
        religionName: nameOf(this.religions, add.religionCode),
        preferredLanguageCode: add.preferredLanguageCode || null,
        preferredLanguageName: nameOf(this.languages, add.preferredLanguageCode),
      },
    };
  }
}
