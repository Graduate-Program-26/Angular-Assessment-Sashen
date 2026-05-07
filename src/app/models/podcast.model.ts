export interface DeezerPodcast {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly picture: string;
  readonly picture_small: string;
  readonly picture_medium: string;
  readonly picture_big: string;
  readonly fans: number;
  readonly link: string;
}
