export interface GuestUser {
  readonly displayName: string;
  readonly initial: string;
}

export interface AuthState {
  readonly isAuthenticated: boolean;
  readonly user: GuestUser | null;
}