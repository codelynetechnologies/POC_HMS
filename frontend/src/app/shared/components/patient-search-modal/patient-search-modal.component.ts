import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { PatientSearchResult } from '../../../core/models/patient.models';

@Component({
  selector: 'app-patient-search-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <header class="modal__header">
          <h3>Search Patient</h3>
          <button type="button" class="modal__close" (click)="close.emit()" aria-label="Close">
            &times;
          </button>
        </header>

        <form class="modal__criteria" [formGroup]="form" (ngSubmit)="search()">
          <div class="criteria-grid">
            <div class="field">
              <label>MR Number</label>
              <input formControlName="mrNumber" />
            </div>
            <div class="field">
              <label>First Name</label>
              <input formControlName="firstName" />
            </div>
            <div class="field">
              <label>Last Name</label>
              <input formControlName="lastName" />
            </div>
            <div class="field">
              <label>Mobile Number</label>
              <input formControlName="mobileNumber" />
            </div>
            <div class="field">
              <label>Civil ID</label>
              <input formControlName="civilId" />
            </div>
          </div>
          <div class="criteria-actions">
            <button type="button" class="btn-ghost" (click)="reset()">Clear</button>
            <button type="submit" class="btn-primary" [disabled]="loading">
              {{ loading ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </form>

        <div class="modal__results">
          <div class="hint" *ngIf="error">{{ error }}</div>
          <div class="hint" *ngIf="!error && searched && results.length === 0">
            No patients matched your criteria.
          </div>

          <table *ngIf="results.length > 0">
            <thead>
              <tr>
                <th>MR No.</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Mobile</th>
                <th>Civil ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of results">
                <td>{{ r.mrNumber }}</td>
                <td>{{ r.patientName }}</td>
                <td>{{ r.genderText }}</td>
                <td>{{ r.mobileNumber }}</td>
                <td>{{ r.civilId }}</td>
                <td>
                  <button type="button" class="btn-secondary btn-sm" (click)="select.emit(r)">
                    Select
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./patient-search-modal.component.scss'],
})
export class PatientSearchModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly patientService = inject(PatientService);

  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<PatientSearchResult>();

  readonly form = this.fb.group({
    mrNumber: [''],
    firstName: [''],
    lastName: [''],
    mobileNumber: [''],
    civilId: [''],
  });

  results: PatientSearchResult[] = [];
  loading = false;
  searched = false;
  error = '';

  search(): void {
    const raw = this.form.getRawValue();
    const hasCriteria = Object.values(raw).some((v) => !!v && v.trim().length > 0);
    if (!hasCriteria) {
      this.error = 'Provide at least one search criterion.';
      this.results = [];
      this.searched = false;
      return;
    }

    this.loading = true;
    this.error = '';
    this.patientService.search(raw).subscribe({
      next: (res) => {
        this.results = res;
        this.searched = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.friendlyMessage ?? 'Search failed.';
        this.results = [];
        this.loading = false;
      },
    });
  }

  reset(): void {
    this.form.reset({ mrNumber: '', firstName: '', lastName: '', mobileNumber: '', civilId: '' });
    this.results = [];
    this.searched = false;
    this.error = '';
  }
}
