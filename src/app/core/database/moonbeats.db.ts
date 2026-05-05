import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Playlist } from '@models/playlist.model';

export class MoonBeatsDatabase extends Dexie {
  playlists!: Table<Playlist, string>;

  constructor() {
    super('MoonBeatsDB');

    this.version(1).stores({
      playlists: 'id, name, createdAt, updatedAt',
    });
  }
}

export const moonBeatsDb = new MoonBeatsDatabase();