import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SearchStore } from '@store/search.store';
import { TrackCardComponent } from '@shared/components/track-card/track-card.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, TrackCardComponent, SkeletonLoaderComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  protected readonly searchStore = inject(SearchStore);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const genreId = this.route.snapshot.queryParamMap.get('genreId');
    const genreName = this.route.snapshot.queryParamMap.get('genreName') ?? '';
    if (genreId) {
      this.searchStore.loadGenreTracks(genreId, genreName);
    }
  }

  protected handleSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchStore.updateSearchQuery(inputElement.value);
  }

  protected handleClearSearch(): void {
    this.searchStore.clearSearch();
  }
}