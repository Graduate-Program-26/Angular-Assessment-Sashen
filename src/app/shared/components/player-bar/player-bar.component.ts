import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { PlayerStore } from '@store/player.store';
import { DurationPipe } from '@shared/pipes/duration.pipe';

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [DurationPipe, DecimalPipe],
  templateUrl: './player-bar.component.html',
  styleUrl: './player-bar.component.scss',
})
export class PlayerBarComponent {
  protected readonly playerStore = inject(PlayerStore);

  protected handlePlayPauseClick(): void {
    this.playerStore.togglePlayback();
  }

  protected handleSeek(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.playerStore.seekToPercent(Number(inputElement.value));
  }

  protected handleVolumeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.playerStore.setVolume(Number(inputElement.value));
  }
}