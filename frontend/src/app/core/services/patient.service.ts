import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import {
  PatientRegistrationRequest,
  PatientRegistrationResponse,
  PatientSearchRequest,
  PatientSearchResult,
} from '../models/patient.models';

/** Talks to the modern RESTful patient endpoints under /api/patients. */
@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/patients';

  /** Create a new patient or update an existing one when an id is supplied. */
  save(request: PatientRegistrationRequest): Observable<ApiResponse<PatientRegistrationResponse>> {
    return this.http.post<ApiResponse<PatientRegistrationResponse>>(this.baseUrl, request);
  }

  /** Fetch a full patient record by id. */
  getById(id: number): Observable<PatientRegistrationResponse | null> {
    return this.http
      .get<ApiResponse<PatientRegistrationResponse>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  /** Search patients by any subset of criteria. */
  search(request: PatientSearchRequest): Observable<PatientSearchResult[]> {
    return this.http
      .post<ApiResponse<PatientSearchResult[]>>(`${this.baseUrl}/search`, request)
      .pipe(map((res) => res.data ?? []));
  }
}
