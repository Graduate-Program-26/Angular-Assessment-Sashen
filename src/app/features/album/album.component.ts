import { Component, input, signal, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeezerApiService } from '@core/services/deezer-api.service';
import { TrackCardComponent } from '@shared/components/track-card/track-card.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { DurationPipe } from '@shared/pipes/duration.pipe';
import type { DeezerAlbum } from '@models/album.model';
import type { DeezerTrack } from '@models/track.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [RouterLink, TrackCardComponent, SkeletonLoaderComponent, DurationPipe],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss',
})
export class AlbumComponent {

  readonly albumId = input.required<string>();

  private readonly deezerApiService = inject(DeezerApiService);

  protected readonly albumDetails = signal<DeezerAlbum | null>(null);
  protected readonly trackList = signal<readonly DeezerTrack[]>([]);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly loadError = signal<string | null>(null);

  protected readonly releaseYear = computed(() =>
    this.albumDetails()?.release_date?.slice(0, 4) ?? ''
  );

  protected readonly genreNames = computed(() =>
    this.albumDetails()?.genres.data
      .map((genre) => genre.name)
      .join(', ') ?? ''
  );

  constructor() {
    effect(() => { void this.loadAlbumData(this.albumId()); });
  }

  private async loadAlbumData(id: string): Promise<void> {
    this.isLoading.set(true);
    this.loadError.set(null);
    try {
      const [albumData, trackData] = await Promise.all([
        firstValueFrom(this.deezerApiService.fetchAlbumById(id)),
        firstValueFrom(this.deezerApiService.fetchAlbumTracks(id)),
      ]);
      this.albumDetails.set(albumData);
      // Deezer's /album/{id}/tracks response omits the album field — enrich it
      const albumRef = { id: albumData.id, title: albumData.title, cover_small: albumData.cover_small, cover_medium: albumData.cover_medium };
      this.trackList.set(trackData.data.map((t) => ({ ...t, album: albumRef })));
    } catch {
      this.loadError.set('Could not load album. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
