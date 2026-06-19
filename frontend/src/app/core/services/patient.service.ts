import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/auth.models';
import { ApiResponse } from '../models/api-response.model';
import {
  PatientRegistrationRequest,
  PatientRegistrationResponse,
  PatientSearchRequest,
  PatientSearchResult,
} from '../models/patient.models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/patients`;

  save(request: PatientRegistrationRequest): Observable<ApiResponse<PatientRegistrationResponse>> {
    return this.http.post<ApiResponse<PatientRegistrationResponse>>(this.baseUrl, request);
  }

  getById(id: number): Observable<PatientRegistrationResponse | null> {
    return this.http
      .get<ApiResponse<PatientRegistrationResponse>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  search(request: PatientSearchRequest): Observable<PagedResult<PatientSearchResult>> {
    return this.http
      .post<ApiResponse<PagedResult<PatientSearchResult>>>(`${this.baseUrl}/search`, {
        ...request,
        page: request.page ?? 1,
        pageSize: request.pageSize ?? 20,
      })
      .pipe(map((res) => res.data ?? { items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0 }));
  }
}
