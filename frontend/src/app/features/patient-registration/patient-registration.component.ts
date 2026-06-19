import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { DropdownService } from '../../core/services/dropdown.service';
import { PatientService } from '../../core/services/patient.service';
import { DropdownItem, PatientSearchResult } from '../../core/models/patient.models';
import { computeAge, nameOf } from './patient-form.validators';
import { PatientFormBuilderService } from './services/patient-form-builder.service';
import { PatientMasterData, PatientPayloadMapper } from './services/patient-payload.mapper';
import { GeoState, PatientCascadeService } from './services/patient-cascade.service';
import { ToastService } from '../../shared/services/toast.service';

import { PersonalDetailsComponent } from './sections/personal-details.component';
import { AdditionalDetailsComponent } from './sections/additional-details.component';
import { ResidentialAddressComponent } from './sections/residential-address.component';
import { ProfessionalDetailsComponent } from './sections/professional-details.component';
import { InsuranceDocumentsComponent } from './sections/insurance-documents.component';
import { PatientSearchModalComponent } from '../../shared/components/patient-search-modal/patient-search-modal.component';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  providers: [PatientCascadeService],
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
  private readonly formBuilder = inject(PatientFormBuilderService);
  private readonly dropdowns = inject(DropdownService);
  private readonly patients = inject(PatientService);
  private readonly cascade = inject(PatientCascadeService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

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

  readonly form: FormGroup = this.formBuilder.createRegistrationForm();

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
    return [v.firstName, v.middleName, v.lastName].map((p: string) => (p ?? '').trim()).filter(Boolean).join(' ') || 'New Patient';
  }

  get summaryInitials(): string {
    const v = this.form.getRawValue();
    const first = (v.firstName ?? '').trim();
    const last = (v.lastName ?? '').trim();
    return ((first[0] ?? '') + (last[0] ?? first[1] ?? '') || 'NP').toUpperCase();
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
    if (v.ageYears != null && v.ageYears !== '') parts.push(`${v.ageYears}Y`);
    if (v.ageMonths != null && v.ageMonths !== '') parts.push(`${v.ageMonths}M`);
    if (v.ageDays != null && v.ageDays !== '') parts.push(`${v.ageDays}D`);
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
    this.cascade.wireCascades(this.addressForm, this.destroyRef, this.geo, () => !this.suppressCascadeReset);
    this.wireAgeFromDob();
    this.toast.messages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((m) => this.flash(m.type === 'success' ? m.text : '', m.type === 'error' ? m.text : ''));
    this.destroyRef.onDestroy(() => clearTimeout(this.toastTimer));
  }

  private get geo(): GeoState {
    return { states: this.states, cities: this.cities, areas: this.areas };
  }

  private get masterData(): PatientMasterData {
    return {
      prefixes: this.prefixes, genders: this.genders, maritalStatuses: this.maritalStatuses,
      bloodGroups: this.bloodGroups, patientTypes: this.patientTypes, nationalities: this.nationalities,
      races: this.races, religions: this.religions, languages: this.languages,
      occupations: this.occupations, professions: this.professions, incomeCategories: this.incomeCategories,
      countries: this.countries, states: this.states, cities: this.cities, areas: this.areas,
    };
  }

  private flash(success: string, error: string): void {
    this.successMessage = success;
    this.errorMessage = error;
    clearTimeout(this.toastTimer);
    if (success || error) {
      this.toastTimer = setTimeout(() => { this.successMessage = ''; this.errorMessage = ''; }, 5000);
    }
  }

  dismissToast(): void {
    clearTimeout(this.toastTimer);
    this.successMessage = '';
    this.errorMessage = '';
  }

  private loadMasterData(): void {
    forkJoin({
      prefixes: this.dropdowns.get('Prefix'), genders: this.dropdowns.get('Gender'),
      maritalStatuses: this.dropdowns.get('MaritalStatus'), bloodGroups: this.dropdowns.get('BloodGroup'),
      patientTypes: this.dropdowns.get('PatientType'), nationalities: this.dropdowns.get('Nationality'),
      races: this.dropdowns.get('Race'), religions: this.dropdowns.get('Religion'),
      languages: this.dropdowns.get('Language'), occupations: this.dropdowns.get('Occupation'),
      professions: this.dropdowns.get('Profession'), incomeCategories: this.dropdowns.get('IncomeCategory'),
      countries: this.dropdowns.get('Country'),
    }).subscribe({
      next: (data) => { Object.assign(this, data); this.loadingMaster = false; },
      error: (err) => { this.loadingMaster = false; this.toast.error(err?.friendlyMessage ?? 'Failed to load master data.'); },
    });
  }

  private wireAgeFromDob(): void {
    this.form.get('dateOfBirth')!.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: string) => {
      if (this.suppressCascadeReset || !value) return;
      const age = computeAge(new Date(value));
      if (age) this.form.patchValue({ ageYears: age.years, ageMonths: age.months, ageDays: age.days }, { emitEvent: false });
    });
  }

  openSearch(): void { this.showSearch = true; }

  onSearchSelect(result: PatientSearchResult): void {
    this.showSearch = false;
    this.loadPatient(result.id);
  }

  private loadPatient(id: number): void {
    this.dismissToast();
    this.patients.getById(id).subscribe({
      next: (patient) => {
        if (!patient) { this.toast.error('Patient could not be loaded.'); return; }
        const addr = patient.address ?? {};
        this.suppressCascadeReset = true;
        this.cascade.loadGeoForPatient(addr.countryCode, addr.stateCode, addr.cityCode).subscribe({
          error: (err) => { this.suppressCascadeReset = false; this.toast.error(err?.friendlyMessage ?? 'Failed to load address details.'); },
          next: (geo) => {
            this.states = geo.states; this.cities = geo.cities; this.areas = geo.areas;
            this.editingId = patient.id; this.editingMrNumber = patient.mrNumber ?? null;
            this.form.reset(); this.form.patchValue(PatientPayloadMapper.toFormPatch(patient));
            this.suppressCascadeReset = false;
            this.toast.success(`Loaded ${patient.mrNumber} for editing.`);
          },
        });
      },
      error: (err) => this.toast.error(err?.friendlyMessage ?? 'Patient could not be loaded.'),
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please correct the highlighted fields before saving.');
      return;
    }
    this.saving = true;
    this.patients.save(PatientPayloadMapper.toRequest(this.form.getRawValue(), this.editingId, this.editingMrNumber, this.masterData)).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success && res.data) {
          this.editingId = res.data.id; this.editingMrNumber = res.data.mrNumber ?? null;
          this.toast.success(`${res.message ?? 'Patient saved.'} MR Number: ${res.data.mrNumber}`);
          this.form.markAsPristine();
        } else {
          this.toast.error(res.errors?.join(' ') || res.message || 'Save failed.');
        }
      },
      error: (err) => { this.saving = false; this.toast.error(err?.friendlyMessage ?? 'Save failed.'); },
    });
  }

  resetForm(): void {
    this.editingId = null; this.editingMrNumber = null; this.dismissToast();
    this.states = []; this.cities = []; this.areas = [];
    this.form.reset(this.formBuilder.defaultResetValues());
  }
}
