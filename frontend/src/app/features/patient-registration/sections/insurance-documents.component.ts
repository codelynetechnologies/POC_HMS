import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-insurance-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hms-card section">
      <header class="section__head">
        <span class="section__num">04</span>
        <span class="section__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          </svg>
        </span>
        <div>
          <h3 class="section__title">Insurance &amp; Documents</h3>
          <p class="section__sub">Coverage and identity document placeholders</p>
        </div>
      </header>

      <div class="section__body">
        <div class="grid">
          <div class="field span-2">
            <label>Insurance Provider</label>
            <input placeholder="Not captured in this POC" disabled />
          </div>
          <div class="field span-2">
            <label>Policy / Member Number</label>
            <input placeholder="Not captured in this POC" disabled />
          </div>
          <div class="field span-2">
            <label>Identity Document</label>
            <input type="file" disabled />
          </div>
          <div class="field span-2">
            <label>Insurance Card</label>
            <input type="file" disabled />
          </div>
        </div>
        <p class="placeholder-note">
          Insurance capture and document uploads are out of scope for the registration POC and are
          shown here as placeholders to mark where they integrate in the full migration.
        </p>
      </div>
    </section>
  `,
  styleUrls: ['./section.shared.scss'],
})
export class InsuranceDocumentsComponent {}
