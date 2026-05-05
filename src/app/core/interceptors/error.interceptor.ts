import { type HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

function toUserMessage(error: HttpErrorResponse): string {
  if (!navigator.onLine) return 'No internet connection. Please check your network.';
  switch (error.status) {
    case 404: return 'That content could not be found.';
    case 429: return 'Too many requests. Please wait a moment.';
    case 500: case 502: case 503:
      return 'Deezer is temporarily unavailable. Please try again.';
    default: return 'Something went wrong. Please try again.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: unknown) => {
      const message = error instanceof HttpErrorResponse
        ? toUserMessage(error)
        : 'An unexpected error occurred.';
      return throwError(() => new Error(message));
    }),
  );