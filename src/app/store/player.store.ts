import { Injectable, signal, computed } from '@angular/core';
import type { DeezerTrack } from '@models/track.model';

@Injectable({ providedIn: 'root' })
export class PlayerStore {

  private readonly _currentTrack    = signal<DeezerTrack | null>(null);
  private readonly _isPlaying        = signal<boolean>(false);
  private readonly _volume           = signal<number>(75);
  private readonly _currentTimeMs    = signal<number>(0);

  readonly currentTrack  = this._currentTrack.asReadonly();
  readonly isPlaying     = this._isPlaying.asReadonly();
  readonly volume        = this._volume.asReadonly();
  readonly currentTimeMs = this._currentTimeMs.asReadonly();

  readonly hasActiveTrack = computed(() => this._currentTrack() !== null);
  readonly playerLabel    = computed(() => {
    const track = this._currentTrack();
    return track ? `${track.title} — ${track.artist.name}` : 'Nothing playing';
  });

  loadTrack(trackToPlay: DeezerTrack): void {
    this._currentTrack.set(trackToPlay);
    this._currentTimeMs.set(0);
    this._isPlaying.set(true);
  }

  togglePlayback(): void {
    this._isPlaying.update((wasPlaying) => !wasPlaying);
  }

  setVolume(newVolumeLevel: number): void {
    this._volume.set(Math.max(0, Math.min(100, newVolumeLevel)));
  }

  updateCurrentTime(elapsedTimeMs: number): void {
    this._currentTimeMs.set(elapsedTimeMs);
  }
}
