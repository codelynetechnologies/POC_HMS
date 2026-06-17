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
      <header class="section__head">
        <span class="section__num">03</span>
        <span class="section__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </span>
        <div>
          <h3 class="section__title">Professional Details</h3>
          <p class="section__sub">Occupation and employment information</p>
        </div>
      </header>

      <div class="section__body">
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
