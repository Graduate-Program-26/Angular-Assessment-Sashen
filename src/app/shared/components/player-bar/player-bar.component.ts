import { Component, inject } from '@angular/core';
import { PlayerStore } from '@store/player.store';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [DurationPipe],
  templateUrl: './player-bar.component.html',
  styleUrl: './player-bar.component.scss',
})
export class PlayerBarComponent {
  protected readonly playerStore = inject(PlayerStore);

  protected handlePlayPauseClick(): void {
    this.playerStore.togglePlayback();
  }
}