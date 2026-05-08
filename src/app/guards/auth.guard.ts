import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { filter, switchMap, map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth0 = inject(Auth0Service);

  return auth0.isLoading$.pipe(
    filter((loading) => !loading),
    take(1),
    switchMap(() => auth0.isAuthenticated$),
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) return true;
      auth0.loginWithRedirect();
      return false;
    }),
  );
};
