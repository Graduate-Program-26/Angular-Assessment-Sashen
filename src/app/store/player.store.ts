import { Injectable, signal, computed, effect } from '@angular/core';
import type { DeezerTrack } from '@models/track.model';

const VOLUME_STORAGE_KEY = 'moonbeats_volume';

@Injectable({ providedIn: 'root' })
export class PlayerStore {

  // Private state signals
  private readonly _currentTrack = signal<DeezerTrack | null>(null);
  private readonly _isPlaying = signal<boolean>(false);
  private readonly _volume = signal<number>(
    Number(localStorage.getItem(VOLUME_STORAGE_KEY)) || 75
  );
  private readonly _currentTimeMs = signal<number>(0);
  private readonly _durationMs = signal<number>(30_000);

  // Public readonly signals
  readonly currentTrack  = this._currentTrack.asReadonly();
  readonly isPlaying = this._isPlaying.asReadonly();
  readonly volume = this._volume.asReadonly();
  readonly currentTimeMs = this._currentTimeMs.asReadonly();
  readonly durationMs = this._durationMs.asReadonly();

  // Computed Signals
  readonly hasActiveTrack = computed(() => this._currentTrack() !== null);
  readonly progressPct = computed(() =>
    this._durationMs() > 0
      ? (this._currentTimeMs() / this._durationMs()) * 100
      : 0
  );
  readonly playerLabel = computed(() => {
    const track = this._currentTrack();
    return track
      ? `${track.title} — ${track.artist.name}`
      : 'Nothing playing';
  });

  // Audio element 
  private readonly audioElement = new Audio();

  constructor() {
    this.audioElement.volume = this._volume() / 100;

    /* effect() keeps the audio element in sync with signal state.
     * When _isPlaying changes: play or pause the audio.*/
    effect(() => {
      if (this._isPlaying()) {
        void this.audioElement.play();
      } else {
        this.audioElement.pause();
      }
    });

    // Persist volume whenever it changes
    effect(() => {
      const volumeLevel = this._volume();
      this.audioElement.volume = volumeLevel / 100;
      localStorage.setItem(VOLUME_STORAGE_KEY, String(volumeLevel));
    });

    // Update currentTimeMs from audio element timeupdate event 
    this.audioElement.addEventListener('timeupdate', () => {
      this._currentTimeMs.set(this.audioElement.currentTime * 1_000);
    });

    this.audioElement.addEventListener('ended', () => {
      this._isPlaying.set(false);
      this._currentTimeMs.set(0);
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      this._durationMs.set(this.audioElement.duration * 1_000);
    });
  }

  // Mutators
  loadTrack(trackToPlay: DeezerTrack): void {
    this.audioElement.src = trackToPlay.preview;
    this.audioElement.load();
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

  seekToPercent(seekPercent: number): void {
    const seekTime = (this.audioElement.duration * seekPercent) / 100;
    this.audioElement.currentTime = seekTime;
  }
}