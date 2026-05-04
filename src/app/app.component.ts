import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayerBarComponent } from '@shared/components/player-bar/player-bar.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlayerBarComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}