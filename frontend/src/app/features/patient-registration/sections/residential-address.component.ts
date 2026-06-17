import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownItem } from '../../../core/models/patient.models';

@Component({
  selector: 'app-residential-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="hms-card section" [formGroup]="form">
      <header class="section__head">
        <span class="section__num">02</span>
        <span class="section__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </span>
        <div>
          <h3 class="section__title">Residential Address</h3>
          <p class="section__sub">Location and landline contact details</p>
        </div>
      </header>

      <div class="section__body">
        <div class="grid">
          <div class="field span-2">
            <label for="addressLine">Address Line</label>
            <input id="addressLine" formControlName="addressLine" />
          </div>

          <div class="field">
            <label for="phoneCountryCode">Phone Code</label>
            <input id="phoneCountryCode" formControlName="phoneCountryCode" placeholder="+91" />
          </div>

          <div class="field">
            <label for="stdCode">STD Code</label>
            <input id="stdCode" formControlName="stdCode" />
          </div>

          <div class="field">
            <label for="phoneNumber">Landline</label>
            <input id="phoneNumber" formControlName="phoneNumber" />
          </div>

          <div class="field">
            <label for="countryCode">Country</label>
            <select id="countryCode" formControlName="countryCode">
              <option value="">Select</option>
              <option *ngFor="let o of countries" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="stateCode">State</label>
            <select id="stateCode" formControlName="stateCode" [disabled]="!states.length">
              <option value="">{{ states.length ? 'Select' : 'Select country first' }}</option>
              <option *ngFor="let o of states" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="cityCode">City</label>
            <select id="cityCode" formControlName="cityCode" [disabled]="!cities.length">
              <option value="">{{ cities.length ? 'Select' : 'Select state first' }}</option>
              <option *ngFor="let o of cities" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="areaCode">Area</label>
            <select id="areaCode" formControlName="areaCode" [disabled]="!areas.length">
              <option value="">{{ areas.length ? 'Select' : 'Select city first' }}</option>
              <option *ngFor="let o of areas" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="pincode">Pincode</label>
            <input id="pincode" formControlName="pincode" [class.is-invalid]="invalid('pincode')" />
            <div class="field-error" *ngIf="invalid('pincode')">Pincode must be 3 to 10 digits.</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./section.shared.scss'],
})
export class ResidentialAddressComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() countries: DropdownItem[] = [];
  @Input() states: DropdownItem[] = [];
  @Input() cities: DropdownItem[] = [];
  @Input() areas: DropdownItem[] = [];

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }
}
