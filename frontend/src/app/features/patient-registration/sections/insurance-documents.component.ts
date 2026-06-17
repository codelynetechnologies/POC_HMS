import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-insurance-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hms-card section">
      <h3 class="hms-section-title">Insurance &amp; Documents</h3>
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
    </section>
  `,
  styleUrls: ['./section.shared.scss'],
})
export class InsuranceDocumentsComponent {}
