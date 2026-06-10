import { Injectable, signal, computed, effect, inject } from '@angular/core';
import type { DeezerTrack } from '@models/track.model';
import { RecentlyPlayedStore } from '@store/recently-played.store';

const VOLUME_STORAGE_KEY = 'moonbeats_volume';

@Injectable({ providedIn: 'root' })
export class PlayerStore {
  private readonly recentStore = inject(RecentlyPlayedStore);

  // Private state signals
  private readonly _currentTrack = signal<DeezerTrack | null>(null);
  private readonly _isPlaying = signal<boolean>(false);
  private readonly _volume = signal<number>(
    Number(localStorage.getItem(VOLUME_STORAGE_KEY)) || 75
  );
  private readonly _currentTimeMs = signal<number>(0);
  private readonly _durationMs = signal<number>(30_000);
  private readonly _queue = signal<readonly DeezerTrack[]>([]);
  private readonly _queueIndex = signal<number>(-1);
  private readonly _shuffle = signal<boolean>(false);

  // Public readonly signals 
  readonly currentTrack = this._currentTrack.asReadonly();
  readonly isPlaying = this._isPlaying.asReadonly();
  readonly volume = this._volume.asReadonly();
  readonly currentTimeMs = this._currentTimeMs.asReadonly();
  readonly durationMs = this._durationMs.asReadonly();
  readonly queue = this._queue.asReadonly();
  readonly queueIndex = this._queueIndex.asReadonly();
  readonly shuffle = this._shuffle.asReadonly();

  // Computed signals
  readonly hasActiveTrack = computed(() => this._currentTrack() !== null);
  readonly progressPct = computed(() =>
    this._durationMs() > 0
      ? (this._currentTimeMs() / this._durationMs()) * 100
      : 0
  );
  readonly playerLabel = computed(() => {
    const track = this._currentTrack();
    return track ? `${track.title} — ${track.artist.name}` : 'Nothing playing';
  });
  readonly hasNext = computed(() => this._queueIndex() < this._queue().length - 1);
  readonly hasPrevious = computed(() => this._queueIndex() > 0);

  // Audio element 
  private readonly audioElement = new Audio();

  constructor() {
    this.audioElement.volume = this._volume() / 100;

    effect(() => {
      if (this._isPlaying()) {
        void this.audioElement.play();
      } else {
        this.audioElement.pause();
      }
    });

    effect(() => {
      const volumeLevel = this._volume();
      this.audioElement.volume = volumeLevel / 100;
      localStorage.setItem(VOLUME_STORAGE_KEY, String(volumeLevel));
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this._currentTimeMs.set(this.audioElement.currentTime * 1_000);
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      this._durationMs.set(this.audioElement.duration * 1_000);
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.hasNext()) {
        this.playNext();
      } else {
        this._isPlaying.set(false);
        this._currentTimeMs.set(0);
      }
    });
  }

  private queueAt(idx: number): DeezerTrack | undefined {
    const q = this._queue();
    return idx >= 0 && idx < q.length ? q[idx] : undefined;
  }

  loadTrack(track: DeezerTrack, queue: readonly DeezerTrack[] = []): void {
    if (queue.length > 0) {
      this._queue.set(queue);
      this._queueIndex.set(queue.findIndex((t) => t.id === track.id));
    }
    this.audioElement.src = track.preview;
    this._currentTrack.set(track);
    this._currentTimeMs.set(0);
    this._isPlaying.set(true);
    void this.audioElement.play();
    this.recentStore.addTrack(track);
  }

  playNext(): void {
    if (this._shuffle()) {
      const idx = Math.floor(Math.random() * this._queue().length);
      const track = this.queueAt(idx);
      if (track === undefined) return;
      this._queueIndex.set(idx);
      this.loadTrack(track);
      return;
    }
    if (!this.hasNext()) return;
    const nextIdx = this._queueIndex() + 1;
    const nextTrack = this.queueAt(nextIdx);
    if (nextTrack === undefined) return;
    this._queueIndex.set(nextIdx);
    this.loadTrack(nextTrack);
  }

  playPrevious(): void {
    if (!this.hasPrevious()) return;
    const prevIdx = this._queueIndex() - 1;
    const prevTrack = this.queueAt(prevIdx);
    if (prevTrack === undefined) return;
    this._queueIndex.set(prevIdx);
    this.loadTrack(prevTrack);
  }

  addToQueue(track: DeezerTrack): void {
    this._queue.update((q) => [...q, track]);
  }

  toggleShuffle(): void {
    this._shuffle.update((s) => !s);
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
