import { Component, inject, afterNextRender } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone:  true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private returnUrl = '/home';

  constructor() {
    afterNextRender(() => {
      this.returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl') ?? '/home';
    });
  }

  protected handleEnter(): void {
    this.authService.enterAsGuest(this.returnUrl);
  }
}