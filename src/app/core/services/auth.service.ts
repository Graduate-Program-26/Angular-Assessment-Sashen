import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import type { AuthState, GuestUser } from '@models/auth.model';

const GUEST_USER: GuestUser = { displayName: 'Guest', initial: 'S' };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  private readonly _authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  readonly isAuthenticated = computed(() => this._authState().isAuthenticated);
  readonly currentUser     = computed(() => this._authState().user);

  enterAsGuest(returnUrl = '/search'): void {
    this._authState.set({ isAuthenticated: true, user: GUEST_USER });
    void this.router.navigateByUrl(returnUrl);
  }

  logout(): void {
    this._authState.set({ isAuthenticated: false, user: null });
    void this.router.navigate(['/']);
  }
}