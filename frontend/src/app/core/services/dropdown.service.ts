import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { DropdownItem } from '../models/patient.models';

/**
 * Fetches master/dropdown data from the modern REST endpoint
 * (GET /api/dropdowns/{type}?parentCode=...). Non-cascading lists are cached.
 */
@Injectable({ providedIn: 'root' })
export class DropdownService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/dropdowns';
  private readonly cache = new Map<string, Observable<DropdownItem[]>>();

  /** Fetch a static (non-cascading) dropdown category, cached for the session. */
  get(type: string): Observable<DropdownItem[]> {
    if (!this.cache.has(type)) {
      this.cache.set(type, this.fetch(type).pipe(shareReplay(1)));
    }
    return this.cache.get(type)!;
  }

  /** Fetch a cascading dropdown filtered by its parent code (not cached). */
  getCascaded(type: string, parentCode: string | null | undefined): Observable<DropdownItem[]> {
    if (!parentCode) {
      return of([]);
    }
    return this.fetch(type, parentCode);
  }

  private fetch(type: string, parentCode?: string): Observable<DropdownItem[]> {
    const url = parentCode
      ? `${this.baseUrl}/${encodeURIComponent(type)}?parentCode=${encodeURIComponent(parentCode)}`
      : `${this.baseUrl}/${encodeURIComponent(type)}`;
    return this.http
      .get<ApiResponse<DropdownItem[]>>(url)
      .pipe(map((res) => res.data ?? []));
  }
}
