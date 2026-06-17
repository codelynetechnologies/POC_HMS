import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { PatientSearchResult } from '../../../core/models/patient.models';

@Component({
  selector: 'app-patient-search-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
        (click)="$event.stopPropagation()"
      >
        <header class="modal__header">
          <div class="modal__header-title">
            <span class="modal__header-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <h3 id="search-modal-title">Search Patient</h3>
          </div>
          <button type="button" class="modal__close" (click)="close.emit()" aria-label="Close">
            &times;
          </button>
        </header>

        <form class="modal__criteria" [formGroup]="form" (ngSubmit)="search()">
          <div class="criteria-grid">
            <div class="field">
              <label>MR Number</label>
              <input #firstField formControlName="mrNumber" />
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
              <span class="spinner" *ngIf="loading"></span>
              {{ loading ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </form>

        <div class="modal__results">
          <div class="hint hint--error" *ngIf="error">{{ error }}</div>
          <div class="hint" *ngIf="!error && searched && !loading && results.length === 0">
            No patients matched your criteria.
          </div>

          <div class="results-table-wrap" *ngIf="loading || results.length > 0">
            <table>
              <thead>
                <tr>
                  <th>MR No.</th>
                  <th>Patient Name</th>
                  <th>Gender</th>
                  <th>Mobile</th>
                  <th>Civil ID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <ng-container *ngIf="loading">
                  <tr *ngFor="let i of skeletonRows">
                    <td *ngFor="let c of skeletonCols"><span class="skeleton skeleton-line"></span></td>
                  </tr>
                </ng-container>

                <ng-container *ngIf="!loading">
                  <tr *ngFor="let r of results">
                    <td><span class="mono">{{ r.mrNumber }}</span></td>
                    <td>
                      <div class="name-cell">
                        <span class="avatar avatar--sm">{{ initials(r.patientName) }}</span>
                        <span>{{ r.patientName }}</span>
                      </div>
                    </td>
                    <td>{{ r.genderText }}</td>
                    <td>{{ r.mobileNumber }}</td>
                    <td>
                      <span *ngIf="r.civilId">{{ r.civilId }}</span>
                      <span class="badge badge--muted" *ngIf="!r.civilId">Pending</span>
                    </td>
                    <td class="cell-action">
                      <button type="button" class="btn-secondary btn-sm" (click)="select.emit(r)">
                        Select
                      </button>
                    </td>
                  </tr>
                </ng-container>
              </tbody>
            </table>
          </div>

          <div class="results-meta" *ngIf="!loading && results.length > 0">
            Showing {{ results.length }} result{{ results.length === 1 ? '' : 's' }}
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./patient-search-modal.component.scss'],
})
export class PatientSearchModalComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly patientService = inject(PatientService);

  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<PatientSearchResult>();

  @ViewChild('firstField') firstField?: ElementRef<HTMLInputElement>;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.firstField?.nativeElement.focus());
  }

  readonly form = this.fb.group({
    mrNumber: [''],
    firstName: [''],
    lastName: [''],
    mobileNumber: [''],
    civilId: [''],
  });

  readonly skeletonRows = [0, 1, 2, 3];
  readonly skeletonCols = [0, 1, 2, 3, 4, 5];

  results: PatientSearchResult[] = [];
  loading = false;
  searched = false;
  error = '';

  initials(name: string | null | undefined): string {
    const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    const first = parts[0][0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0][1] ?? '');
    return (first + last).toUpperCase();
  }

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
