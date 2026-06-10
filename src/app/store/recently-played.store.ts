import { Injectable, signal, computed } from '@angular/core';
import type { DeezerTrack } from '@models/track.model';

const MAX_RECENT = 10;
const STORAGE_KEY = 'moonbeats_recent';

@Injectable({ providedIn: 'root' })
export class RecentlyPlayedStore {

  private readonly _tracks = signal<readonly DeezerTrack[]>(
    JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  );

  readonly tracks = this._tracks.asReadonly();
  readonly hasRecent = computed(() => this._tracks().length > 0);
  readonly topArtist = computed(() => {
    const counts = new Map<string, number>();
    this._tracks().forEach((t) =>
      counts.set(t.artist.name, (counts.get(t.artist.name) ?? 0) + 1)
    );
    let top = '', max = 0;
    counts.forEach((count, name) => { if (count > max) { max = count; top = name; } });
    return top;
  });

  addTrack(track: DeezerTrack): void {
    this._tracks.update((existing) => {
      const filtered = existing.filter((t) => t.id !== track.id);
      const updated  = [track, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  clear(): void {
    this._tracks.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }
}