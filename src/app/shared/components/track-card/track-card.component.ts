import { Component, input, computed, inject, signal, HostListener } from '@angular/core';
import { DurationPipe } from '@shared/pipes/duration.pipe';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';
import { PlayerStore } from '@store/player.store';
import { LikedStore } from '@store/liked.store';
import { PlaylistStore } from '@store/playlist.store';
import type { DeezerTrack } from '@models/track.model';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [DurationPipe, TruncatePipe],
  templateUrl: './track-card.component.html',
  styleUrl: './track-card.component.scss',
})
export class TrackCardComponent {

  readonly track = input.required<DeezerTrack>();
  readonly trackNumber = input<number | null>(null);

  private readonly playerStore = inject(PlayerStore);
  protected readonly likedStore = inject(LikedStore);
  protected readonly playlistStore = inject(PlaylistStore);

  protected readonly isCurrentlyPlaying = computed(() =>
    this.playerStore.currentTrack()?.id === this.track().id
      && this.playerStore.isPlaying()
  );

  protected readonly showMenu = signal(false);

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showMenu.set(false);
  }

  protected handlePlayClick(): void {
    this.playerStore.loadTrack(this.track());
  }

  protected handleLikeToggle(event: Event): void {
    event.stopPropagation();
    void this.likedStore.toggle(this.track());
  }

  protected handleMenuToggle(event: Event): void {
    event.stopPropagation();
    this.showMenu.update((v) => !v);
  }

  protected handleAddToPlaylist(event: Event, playlistId: string): void {
    event.stopPropagation();
    void this.playlistStore.addTrackToPlaylist(playlistId, this.track());
    this.showMenu.set(false);
  }
}
