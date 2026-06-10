import type { DeezerArtistRef } from './artist.model';
import type { DeezerAlbumRef }  from './album.model';

export interface DeezerTrack {
  readonly id:              number;
  readonly title:           string;
  readonly title_short:     string;
  readonly link:            string;
  readonly duration:        number;  
  readonly rank:            number;
  readonly explicit_lyrics: boolean;
  readonly preview:         string;  
  readonly artist:          DeezerArtistRef;
  readonly album:           DeezerAlbumRef;
  readonly track_position:  number | undefined;
}