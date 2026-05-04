export interface Track {
  readonly id:       number;
  readonly title:    string;
  readonly duration: number;
  readonly preview:  string;
  readonly artist:   { readonly id: number; readonly name: string; readonly picture_medium: string };
  readonly album:    { readonly id: number; readonly title: string; readonly cover_medium: string };
}
