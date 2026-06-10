import type { DeezerArtistRef } from './artist.model';

export interface DeezerAlbum {
  readonly id:             number;
  readonly title:          string;
  readonly link:           string;
  readonly cover:          string;
  readonly cover_small:    string;
  readonly cover_medium:   string;
  readonly cover_big:      string;
  readonly cover_xl:       string;
  readonly genre_id:       number;
  readonly genres:         { readonly data: readonly { readonly id: number; readonly name: string }[] };
  readonly label:          string;
  readonly nb_tracks:      number;
  readonly duration:       number;
  readonly fans:           number;
  readonly release_date:   string;
  readonly record_type:    string;
  readonly artist:         DeezerArtistRef;
}

/** Minimal album reference embedded in Track responses */
export interface DeezerAlbumRef {
  readonly id:           number;
  readonly title:        string;
  readonly cover_small:  string;
  readonly cover_medium: string;
}