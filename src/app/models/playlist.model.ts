import type { DeezerTrack } from './track.model';

export interface Playlist {
  readonly id:          string;   
  readonly name:        string;
  readonly createdAt:   number;   
  readonly updatedAt:   number;
  readonly tracks:      readonly DeezerTrack[];
}

export type PlaylistDraft = Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>;