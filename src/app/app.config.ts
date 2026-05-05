import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, TitleStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
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
    { provide: TitleStrategy, useClass: MoonBeatsTitleStrategy },
  ],
};