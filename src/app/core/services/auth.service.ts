import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import type { MoonBeatsUser } from '@models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly auth0 = inject(Auth0Service);

  readonly isAuthenticated = toSignal(this.auth0.isAuthenticated$, { initialValue: false });
  readonly isLoading       = toSignal(this.auth0.isLoading$,       { initialValue: true  });

  private readonly _auth0User = toSignal(this.auth0.user$, { initialValue: null });

  readonly currentUser = computed((): MoonBeatsUser | null => {
    const u = this._auth0User();
    if (!u) return null;
    return {
      sub:     u.sub     ?? '',
      name:    u.name    ?? 'User',
      email:   u.email   ?? '',
      picture: u.picture ?? '',
      initial: (u.name ?? 'U').charAt(0).toUpperCase(),
    };
  });

  login(): void {
    this.auth0.loginWithRedirect();
  }

  loginWithGoogle(): void {
    this.auth0.loginWithRedirect({
      authorizationParams: { connection: 'google-oauth2' },
    });
  }

  logout(): void {
    this.auth0.logout({
      logoutParams: { returnTo: window.location.origin },
    });
  }
}
