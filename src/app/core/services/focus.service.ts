import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FocusService {
  private readonly router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
    ).subscribe(() => {
      // Small delay allows the new component to render first
      setTimeout(() => {
        const mainHeading = document.querySelector<HTMLElement>('main h1');
        if (mainHeading) {
          mainHeading.setAttribute('tabindex', '-1');
          mainHeading.focus({ preventScroll: false });
        }
      }, 100);
    });
  }
}