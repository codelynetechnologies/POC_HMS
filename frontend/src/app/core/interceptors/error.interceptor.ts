import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/** Normalises API errors into a single human-readable message on the error object. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred. Please try again.';
      const body = error.error;
      if (body && typeof body === 'object') {
        if (Array.isArray(body.errors) && body.errors.length > 0) {
          message = body.errors.join(' ');
        } else if (typeof body.message === 'string' && body.message) {
          message = body.message;
        }
      } else if (error.status === 0) {
        message = 'Cannot reach the server. Please check your connection.';
      }
      return throwError(() => ({ ...error, friendlyMessage: message }));
    }),
  );
};
