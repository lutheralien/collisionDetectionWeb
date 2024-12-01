import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AppState } from '../state/app.state';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const $state = inject(AppState);
  const router = inject(Router);

  const { token } = $state.getState();
  // Clone the request and set the new header
  const authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
    },
  });

  // Send the newly created request
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
         $state.setState({ refreshToken: '' });
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};



