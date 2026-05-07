import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Playlist } from '@models/playlist.model';
import type { DeezerTrack } from '@models/track.model';

export class MoonBeatsDatabase extends Dexie {
  playlists!: Table<Playlist, string>;
  liked!: Table<DeezerTrack, number>; // key is track.id

  constructor() {
    super('MoonBeatsDB');

    this.version(1).stores({
      playlists: 'id, name, createdAt, updatedAt',
    });

    this.version(2).stores({
      playlists: 'id, name, createdAt, updatedAt', 
      liked: 'id, title, artist.name',        
    });
  }
}

export const moonBeatsDb = new MoonBeatsDatabase();