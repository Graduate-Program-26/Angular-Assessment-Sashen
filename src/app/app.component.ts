import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayerBarComponent } from '@shared/components/player-bar/player-bar.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FocusService } from '@core/services/focus.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlayerBarComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly _focusService = inject(FocusService);
}