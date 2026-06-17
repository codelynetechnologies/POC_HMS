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
      <h3 class="hms-section-title">Personal Details</h3>

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
            <input type="number" formControlName="ageYears" placeholder="Y" min="0" />
            <input type="number" formControlName="ageMonths" placeholder="M" min="0" />
            <input type="number" formControlName="ageDays" placeholder="D" min="0" />
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
