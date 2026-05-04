import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface EnvironmentConfig {
  readonly production:       boolean;
  readonly deezerApiBaseUrl: string;
}

export const ENVIRONMENT_CONFIG =
  new InjectionToken<EnvironmentConfig>('EnvironmentConfig', {
    providedIn: 'root',
    factory: () => environment,
  });
