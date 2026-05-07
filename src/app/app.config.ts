import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, TitleStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { appRoutes } from './routes/app.routes';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { MoonBeatsTitleStrategy } from '@core/strategies/page-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withViewTransitions(),
    ),

    provideHttpClient(
      withInterceptors([errorInterceptor]),
    ),

    provideAuth0({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),

    { provide: TitleStrategy, useClass: MoonBeatsTitleStrategy },
  ],
};