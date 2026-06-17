import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownItem } from '../../../core/models/patient.models';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="hms-card section" [formGroup]="form">
      <header class="section__head">
        <span class="section__num">01</span>
        <span class="section__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <div>
          <h3 class="section__title">Personal Details</h3>
          <p class="section__sub">Core demographic and contact information</p>
        </div>
      </header>

      <div class="section__body">
        <div class="grid">
          <div class="field">
            <label for="patientType">Patient Type</label>
            <select id="patientType" formControlName="patientType">
              <option *ngFor="let o of patientTypes" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="prefixCode">Title</label>
            <select id="prefixCode" formControlName="prefixCode">
              <option value="">Select</option>
              <option *ngFor="let o of prefixes" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="appointmentReference">Appointment Reference</label>
            <input id="appointmentReference" formControlName="appointmentReference" placeholder="APT-0000" />
          </div>

          <div class="field">
            <label class="required" for="firstName">First Name</label>
            <input
              id="firstName"
              formControlName="firstName"
              [class.is-invalid]="invalid('firstName')"
            />
            <div class="field-error" *ngIf="invalid('firstName')">First name is required.</div>
          </div>

          <div class="field">
            <label for="middleName">Middle Name</label>
            <input id="middleName" formControlName="middleName" />
          </div>

          <div class="field">
            <label class="required" for="lastName">Last Name</label>
            <input id="lastName" formControlName="lastName" [class.is-invalid]="invalid('lastName')" />
            <div class="field-error" *ngIf="invalid('lastName')">Last name is required.</div>
          </div>

          <div class="field">
            <label class="required" for="gender">Gender</label>
            <select id="gender" formControlName="gender">
              <option *ngFor="let o of genders" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="dateOfBirth">Date of Birth</label>
            <input id="dateOfBirth" type="date" formControlName="dateOfBirth" [max]="today" />
            <div class="field-error" *ngIf="invalid('dateOfBirth')">
              Date of birth cannot be in the future.
            </div>
          </div>

          <div class="field">
            <label>Age (Y / M / D)</label>
            <div class="age-row">
              <input type="number" formControlName="ageYears" placeholder="Y" min="0" aria-label="Age years" />
              <input type="number" formControlName="ageMonths" placeholder="M" min="0" aria-label="Age months" />
              <input type="number" formControlName="ageDays" placeholder="D" min="0" aria-label="Age days" />
            </div>
          </div>

          <div class="field">
            <label for="mobileCountryCode">Mobile Code</label>
            <input id="mobileCountryCode" formControlName="mobileCountryCode" placeholder="+91" />
          </div>

          <div class="field">
            <label class="required" for="mobileNumber">Mobile Number</label>
            <input
              id="mobileNumber"
              formControlName="mobileNumber"
              [class.is-invalid]="invalid('mobileNumber')"
            />
            <div class="field-error" *ngIf="invalid('mobileNumber')">
              Mobile number must be 7 to 15 digits.
            </div>
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input id="email" formControlName="email" [class.is-invalid]="invalid('email')" />
            <div class="field-error" *ngIf="invalid('email')">Email is not valid.</div>
          </div>

          <div class="field">
            <label for="maritalStatusCode">Marital Status</label>
            <select id="maritalStatusCode" formControlName="maritalStatusCode">
              <option value="">Select</option>
              <option *ngFor="let o of maritalStatuses" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="bloodGroupCode">Blood Group</label>
            <select id="bloodGroupCode" formControlName="bloodGroupCode">
              <option value="">Select</option>
              <option *ngFor="let o of bloodGroups" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="civilId">Civil ID</label>
            <input id="civilId" formControlName="civilId" />
          </div>

          <div class="field">
            <label for="familyName">Family Name</label>
            <input id="familyName" formControlName="familyName" />
          </div>
        </div>

        <div class="form-level-error" *ngIf="ageOrDobMissing">
          Either date of birth or age must be provided.
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./section.shared.scss'],
})
export class PersonalDetailsComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() prefixes: DropdownItem[] = [];
  @Input() genders: DropdownItem[] = [];
  @Input() maritalStatuses: DropdownItem[] = [];
  @Input() bloodGroups: DropdownItem[] = [];
  @Input() patientTypes: DropdownItem[] = [];

  readonly today = new Date().toISOString().slice(0, 10);

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  get ageOrDobMissing(): boolean {
    return this.form.hasError('ageOrDobRequired') && (this.form.touched || this.form.dirty);
  }
}
