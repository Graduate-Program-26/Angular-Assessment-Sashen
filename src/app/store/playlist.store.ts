import { Injectable, signal, computed } from '@angular/core';
import { moonBeatsDb } from '@core/database/moonbeats.db';
import type { Playlist, PlaylistDraft } from '@models/playlist.model';
import type { DeezerTrack } from '@models/track.model';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({ providedIn: 'root' })
export class PlaylistStore {

  // Private state signals
  private readonly _playlists   = signal<readonly Playlist[]>([]);
  private readonly _isLoading   = signal<boolean>(true);
  private readonly _activeId    = signal<string | null>(null);

  // Public readonly signals
  readonly playlists   = this._playlists.asReadonly();
  readonly isLoading   = this._isLoading.asReadonly();
  readonly activeId    = this._activeId.asReadonly();

  // Computed Signals
  readonly playlistCount = computed(() => this._playlists().length);

  readonly totalTrackCount = computed(() =>
    this._playlists().reduce((sum, pl) => sum + pl.tracks.length, 0)
  );

  readonly activePlaylist = computed(() =>
    this._playlists().find((pl) => pl.id === this._activeId()) ?? null
  );

  readonly activeDuration = computed(() =>
    this.activePlaylist()?.tracks
      .reduce((sum, track) => sum + track.duration, 0) ?? 0
  );

  constructor() {
    // Rehydrate playlists from IndexedDB on app load
    void this.rehydrate();
  }

  private async rehydrate(): Promise<void> {
    try {
      const savedPlaylists = await moonBeatsDb.playlists
        .orderBy('createdAt')
        .toArray();
      this._playlists.set(savedPlaylists);
    } finally {
      this._isLoading.set(false);
    }
  }

  async createPlaylist(playlistName: string): Promise<void> {
    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name: playlistName.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tracks:[],
    };
    await moonBeatsDb.playlists.add(newPlaylist);
    this._playlists.update((existing) => [...existing, newPlaylist]);
  }

  async renamePlaylist(playlistId: string, newName: string): Promise<void> {
    const updatedAt = Date.now();
    await moonBeatsDb.playlists.update(playlistId, { name: newName.trim(), updatedAt });
    this._playlists.update((existing) =>
      existing.map((pl) => pl.id === playlistId ? { ...pl, name: newName.trim(), updatedAt } : pl)
    );
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    await moonBeatsDb.playlists.delete(playlistId);
    this._playlists.update((existing) =>
      existing.filter((pl) => pl.id !== playlistId)
    );
    if (this._activeId() === playlistId) this._activeId.set(null);
  }

  async addTrackToPlaylist(playlistId: string, trackToAdd: DeezerTrack): Promise<void> {
    const targetPlaylist = this._playlists().find((pl) => pl.id === playlistId);
    if (!targetPlaylist) return;

    const alreadyExists = targetPlaylist.tracks.some((t) => t.id === trackToAdd.id);
    if (alreadyExists) return;

    const updatedTracks = [...targetPlaylist.tracks, trackToAdd];
    const updatedAt = Date.now();
    await moonBeatsDb.playlists.update(playlistId, { tracks: updatedTracks, updatedAt });
    this._playlists.update((existing) =>
      existing.map((pl) => pl.id === playlistId ? { ...pl, tracks: updatedTracks, updatedAt } : pl)
    );
  }

  async removeTrackFromPlaylist(playlistId: string, trackId: number): Promise<void> {
    const targetPlaylist = this._playlists().find((pl) => pl.id === playlistId);
    if (!targetPlaylist) return;

    const filteredTracks = targetPlaylist.tracks.filter((t) => t.id !== trackId);
    const updatedAt = Date.now();
    await moonBeatsDb.playlists.update(playlistId, { tracks: filteredTracks, updatedAt });
    this._playlists.update((existing) =>
      existing.map((pl) => pl.id === playlistId ? { ...pl, tracks: filteredTracks, updatedAt } : pl)
    );
  }

  setActivePlaylist(playlistId: string | null): void {
    this._activeId.set(playlistId);
  }
  async reorderTracks(
    playlistId: string,
    previousIndex: number,
    currentIndex: number
  ): Promise<void> {
    const target = this._playlists().find((pl) => pl.id === playlistId);
    if (!target) return;

    const reordered = [...target.tracks];
    moveItemInArray(reordered, previousIndex, currentIndex);

    const updatedAt = Date.now();
    await moonBeatsDb.playlists.update(playlistId, { tracks: reordered, updatedAt });
    this._playlists.update((pls) =>
      pls.map((pl) => pl.id === playlistId ? { ...pl, tracks: reordered, updatedAt } : pl)
    );
  }
  
}