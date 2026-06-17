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
      <button type="button" class="collapsible-header" (click)="expanded = !expanded">
        <span class="hms-section-title">Additional Details</span>
        <span class="toggle">{{ expanded ? 'Hide' : 'Show' }}</span>
      </button>

      <div class="grid" *ngIf="expanded">
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
