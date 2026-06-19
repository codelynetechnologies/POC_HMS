import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { DropdownService } from '../../../core/services/dropdown.service';
import { DropdownItem } from '../../../core/models/patient.models';

export interface GeoState {
  states: DropdownItem[];
  cities: DropdownItem[];
  areas: DropdownItem[];
}

@Injectable()
export class PatientCascadeService {
  private readonly dropdowns = inject(DropdownService);

  wireCascades(
    addressForm: FormGroup,
    destroyRef: DestroyRef,
    geo: GeoState,
    shouldReset: () => boolean,
  ): void {
    addressForm
      .get('countryCode')!
      .valueChanges.pipe(takeUntilDestroyed(destroyRef))
      .subscribe((code: string) => {
        this.dropdowns.getCascaded('State', code).subscribe((s) => (geo.states = s));
        if (!shouldReset()) return;
        addressForm.patchValue({ stateCode: '', cityCode: '', areaCode: '' });
        geo.cities = [];
        geo.areas = [];
      });

    addressForm
      .get('stateCode')!
      .valueChanges.pipe(takeUntilDestroyed(destroyRef))
      .subscribe((code: string) => {
        this.dropdowns.getCascaded('City', code).subscribe((c) => (geo.cities = c));
        if (!shouldReset()) return;
        addressForm.patchValue({ cityCode: '', areaCode: '' });
        geo.areas = [];
      });

    addressForm
      .get('cityCode')!
      .valueChanges.pipe(takeUntilDestroyed(destroyRef))
      .subscribe((code: string) => {
        this.dropdowns.getCascaded('Area', code).subscribe((a) => (geo.areas = a));
        if (!shouldReset()) return;
        addressForm.patchValue({ areaCode: '' });
      });
  }

  loadGeoForPatient(
    countryCode?: string | null,
    stateCode?: string | null,
    cityCode?: string | null,
  ): Observable<GeoState> {
    return forkJoin({
      states: this.dropdowns.getCascaded('State', countryCode),
      cities: this.dropdowns.getCascaded('City', stateCode),
      areas: this.dropdowns.getCascaded('Area', cityCode),
    });
  }
}
