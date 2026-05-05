import { Component, input, computed, inject } from '@angular/core';
import { DurationPipe } from '../../pipes/duration.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { PlayerStore } from '@store/player.store';
import type { Track } from '@models/track.model';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [DurationPipe, TruncatePipe],
  templateUrl: './track-card.component.html',
  styleUrl: './track-card.component.scss',
})
export class TrackCardComponent {

  readonly track = input.required<Track>();
  readonly trackNumber = input<number | null>(null); 

  private readonly playerStore = inject(PlayerStore);

  protected readonly isCurrentlyPlaying = computed(() =>
    this.playerStore.currentTrack()?.id === this.track().id
      && this.playerStore.isPlaying()
  );

  protected handlePlayClick(): void {
    this.playerStore.loadTrack(this.track());
  }
}