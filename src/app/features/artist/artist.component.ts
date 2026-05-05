import { Component, input, effect, inject } from '@angular/core';
import { DeezerApiService } from '@core/services/deezer-api.service';

@Component({
  selector:    'app-artist',
  standalone:  true,
  templateUrl: './artist.component.html',
  styleUrl:    './artist.component.scss',
})
export class ArtistComponent {

  readonly artistId = input.required<string>();

  private readonly deezerApiService = inject(DeezerApiService);

  constructor() {

    effect(() => {
      const currentArtistId = this.artistId();
      void this.deezerApiService.fetchArtistById(currentArtistId);
    });
  }
}