import { Injectable, signal, computed } from '@angular/core';
import { moonBeatsDb }  from '@core/database/moonbeats.db';
import type { DeezerTrack } from '@models/track.model';

@Injectable({ providedIn: 'root' })
export class LikedStore {

  private readonly _liked = signal<readonly DeezerTrack[]>([]);
  private readonly _likedIds = signal<ReadonlySet<number>>(new Set());

  readonly liked      = this._liked.asReadonly();
  readonly likedCount = computed(() => this._liked().length);
  readonly hasAny     = computed(() => this._liked().length > 0);

  isLiked(trackId: number): boolean {
    return this._likedIds().has(trackId);
  }

  constructor() { void this.rehydrate(); }

  private async rehydrate(): Promise<void> {
    const tracks = await moonBeatsDb.liked.toArray();
    this._liked.set(tracks);
    this._likedIds.set(new Set(tracks.map((t) => t.id)));
  }

  async toggle(track: DeezerTrack): Promise<void> {
    if (this.isLiked(track.id)) {
      await moonBeatsDb.liked.delete(track.id);
      this._liked.update((t) => t.filter((x) => x.id !== track.id));
      this._likedIds.update((s) => { const n = new Set(s); n.delete(track.id); return n; });
    } else {
      await moonBeatsDb.liked.add(track);
      this._liked.update((t) => [...t, track]);
      this._likedIds.update((s) => new Set([...s, track.id]));
    }
  }
}