import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownItem } from '../../../core/models/patient.models';

@Component({
  selector: 'app-additional-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="hms-card section" [formGroup]="form">
      <button type="button" class="section__head section__head--button" (click)="expanded = !expanded"
        [attr.aria-expanded]="expanded">
        <span class="section__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        </span>
        <div>
          <h3 class="section__title">Additional Details</h3>
          <p class="section__sub">Optional demographic and cultural information</p>
        </div>
        <span class="toggle">
          <span class="badge badge--muted">Optional</span>
          {{ expanded ? 'Hide' : 'Show' }}
        </span>
      </button>

      <div class="section__body" *ngIf="expanded">
        <div class="grid">
          <div class="field">
            <label for="nationalityCode">Nationality</label>
            <select id="nationalityCode" formControlName="nationalityCode">
              <option value="">Select</option>
              <option *ngFor="let o of nationalities" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="raceCode">Race</label>
            <select id="raceCode" formControlName="raceCode">
              <option value="">Select</option>
              <option *ngFor="let o of races" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="religionCode">Religion</label>
            <select id="religionCode" formControlName="religionCode">
              <option value="">Select</option>
              <option *ngFor="let o of religions" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field">
            <label for="preferredLanguageCode">Preferred Language</label>
            <select id="preferredLanguageCode" formControlName="preferredLanguageCode">
              <option value="">Select</option>
              <option *ngFor="let o of languages" [value]="o.code">{{ o.name }}</option>
            </select>
          </div>

          <div class="field span-full">
            <label for="warningAlerts">Warning / Alerts</label>
            <textarea
              id="warningAlerts"
              formControlName="warningAlerts"
              rows="2"
              placeholder="Allergies, special handling notes, etc."
            ></textarea>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./section.shared.scss'],
})
export class AdditionalDetailsComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() nationalities: DropdownItem[] = [];
  @Input() races: DropdownItem[] = [];
  @Input() religions: DropdownItem[] = [];
  @Input() languages: DropdownItem[] = [];

  expanded = false;
}
