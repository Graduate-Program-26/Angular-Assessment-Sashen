export interface DeezerArtist {
  readonly id:             number;
  readonly name:           string;
  readonly link:           string;
  readonly picture:        string;
  readonly picture_small:  string;
  readonly picture_medium: string;
  readonly picture_big:    string;
  readonly picture_xl:     string;
  readonly nb_album:       number;
  readonly nb_fan:         number;
  readonly radio:          boolean;
  readonly tracklist:      string;
}

export interface DeezerArtistRef {
  readonly id:             number;
  readonly name:           string;
  readonly picture_small:  string;
  readonly picture_medium: string;
}