export interface MoonBeatsUser {
  readonly sub: string;
  readonly name: string;
  readonly email: string;
  readonly picture: string;
  readonly initial: string;
}

export interface AuthState {
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly user: MoonBeatsUser | null;
}
