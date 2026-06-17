import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownItem } from '../../../core/models/patient.models';

@Component({
  selector: 'app-professional-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="hms-card section" [formGroup]="form">
      <h3 class="hms-section-title">Professional Details</h3>

      <div class="grid">
        <div class="field">
          <label for="occupationCode">Occupation</label>
          <select id="occupationCode" formControlName="occupationCode">
            <option value="">Select</option>
            <option *ngFor="let o of occupations" [value]="o.code">{{ o.name }}</option>
          </select>
        </div>

        <div class="field">
          <label for="professionCode">Profession</label>
          <select id="professionCode" formControlName="professionCode">
            <option value="">Select</option>
            <option *ngFor="let o of professions" [value]="o.code">{{ o.name }}</option>
          </select>
        </div>

        <div class="field">
          <label for="incomeCategoryCode">Income Category</label>
          <select id="incomeCategoryCode" formControlName="incomeCategoryCode">
            <option value="">Select</option>
            <option *ngFor="let o of incomeCategories" [value]="o.code">{{ o.name }}</option>
          </select>
        </div>

        <div class="field">
          <label for="companyName">Company / Employer</label>
          <input id="companyName" formControlName="companyName" />
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./section.shared.scss'],
})
export class ProfessionalDetailsComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() occupations: DropdownItem[] = [];
  @Input() professions: DropdownItem[] = [];
  @Input() incomeCategories: DropdownItem[] = [];
}
