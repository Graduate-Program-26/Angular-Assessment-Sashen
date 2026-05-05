import { Component, input, signal, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { DeezerApiService } from '@core/services/deezer-api.service';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import type { DeezerArtist } from '@models/artist.model';
import type { DeezerAlbum } from '@models/album.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [RouterLink, SlicePipe, SkeletonLoaderComponent],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss',
})
export class ArtistComponent {

  readonly artistId = input.required<string>();

  private readonly deezerApiService = inject(DeezerApiService);

  protected readonly artistProfile = signal<DeezerArtist | null>(null);
  protected readonly artistAlbums = signal<readonly DeezerAlbum[]>([]);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly loadError = signal<string | null>(null);

  protected readonly fanCount = computed(() => {
    const fans = this.artistProfile()?.nb_fan ?? 0;
    return fans >= 1_000_000
      ? `${(fans / 1_000_000).toFixed(1)}M fans`
      : `${(fans / 1_000).toFixed(0)}K fans`;
  });

  constructor() {
    effect(() => {
      void this.loadArtistData(this.artistId());
    });
  }

  private async loadArtistData(id: string): Promise<void> {
    this.isLoading.set(true);
    this.loadError.set(null);
    try {
      const [artistData, albumData] = await Promise.all([
        firstValueFrom(this.deezerApiService.fetchArtistById(id)),
        firstValueFrom(this.deezerApiService.fetchArtistAlbums(id)),
      ]);
      this.artistProfile.set(artistData);
      this.artistAlbums.set(albumData.data);
    } catch {
      this.loadError.set('Could not load artist. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}