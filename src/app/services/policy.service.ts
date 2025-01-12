import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Policy {
  id: number;
  name: string;
  type: 'Life' | 'Health' | 'Vehicle' | 'Universal Life';
  premium: number;
  coverage: number;
}

export interface PolicyResponse {
  message: string;
  policy?: Policy;
}

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  private apiUrl = 'https://insurance-policy-api-cfcthsfqene7azbp.canadacentral-01.azurewebsites.net/api/policy';

  constructor(private http: HttpClient) {}

  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getPolicy(id: number): Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  addPolicy(policy: Policy): Observable<PolicyResponse> {
    return this.http.post<PolicyResponse>(this.apiUrl, policy).pipe(catchError(this.handleError));
  }

  updatePolicy(id: number, policy: Policy): Observable<PolicyResponse> {
    return this.http.put<PolicyResponse>(`${this.apiUrl}/${id}`, policy).pipe(catchError(this.handleError));

  }

  deletePolicy(id: number): Observable<PolicyResponse> {
    return this.http.delete<PolicyResponse>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: The data you submitted is invalid.';
          break;
        case 404:
          errorMessage = 'Not Found: The requested policy could not be found.';
          break;
        case 500:
          errorMessage = 'Server Error: There was a problem processing your request.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
          break;
      }
    }

    return throwError(() => new Error(errorMessage)); // Human-readable error
  }
}

