import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeezerApiService } from '@core/services/deezer-api.service';
import { RecentlyPlayedStore } from '@store/recently-played.store';
import { PlayerStore } from '@store/player.store';
import type { DeezerTrack } from '@models/track.model';
import type { DeezerGenre } from '@models/genre.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected readonly recentStore  = inject(RecentlyPlayedStore);
  private readonly deezerApi      = inject(DeezerApiService);
  private readonly playerStore    = inject(PlayerStore);

  protected readonly isLoading    = signal<boolean>(true);
  protected readonly chartTracks  = signal<readonly DeezerTrack[]>([]);
  protected readonly genres        = signal<readonly DeezerGenre[]>([]);

  protected readonly skeletons = Array.from({ length: 8 }, (_, i) => i);

  constructor() {
    void this.loadData();
  }

  private async loadData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const [tracksRes, genresRes] = await Promise.all([
        firstValueFrom(this.deezerApi.fetchChartTracks()),
        firstValueFrom(this.deezerApi.fetchGenres()),
      ]);
      this.chartTracks.set(tracksRes.data);
      this.genres.set(genresRes.data);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected playTrack(track: DeezerTrack): void {
    this.playerStore.loadTrack(track, this.chartTracks() as DeezerTrack[]);
  }
}
