import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Subject } from 'rxjs';
import { DeezerApiService } from '@core/services/deezer-api.service';
import type { DeezerTrack } from '@models/track.model';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

@Injectable({ providedIn: 'root' })
export class SearchStore {

  private readonly deezerApiService = inject(DeezerApiService);

  private readonly _searchQuery = signal<string>('');
  private readonly _searchResults = signal<readonly DeezerTrack[]>([]);
  private readonly _isSearching = signal<boolean>(false);
  private readonly _searchError = signal<string | null>(null);
  private readonly _totalResults = signal<number>(0);

  readonly searchQuery = this._searchQuery.asReadonly();
  readonly searchResults = this._searchResults.asReadonly();
  readonly isSearching = this._isSearching.asReadonly();
  readonly searchError = this._searchError.asReadonly();
  readonly totalResults = this._totalResults.asReadonly();

  readonly hasResults   = computed(() => this._searchResults().length > 0);
  readonly hasNoResults = computed(() =>
    !this._isSearching() &&
    this._searchQuery().length >= MIN_QUERY_LENGTH &&
    this._searchResults().length === 0
  );

  private readonly searchSubject$ = new Subject<string>();
  private readonly searchSubscription: Subscription;

  constructor() {

    this.searchSubscription = this.searchSubject$.pipe(
      debounceTime(DEBOUNCE_MS),
      switchMap((query: string) => {
        if (query.length < MIN_QUERY_LENGTH) {
          this._searchResults.set([]);
          this._totalResults.set(0);
          return of(null);
        }
        this._isSearching.set(true);
        this._searchError.set(null);
        return this.deezerApiService.searchTracks(query).pipe(
          catchError(() => {
            this._searchError.set('Search failed. Please try again.');
            return of(null);
          }),
        );
      }),
    ).subscribe((response) => {
      this._isSearching.set(false);
      if (response) {
        this._searchResults.set(response.data);
        this._totalResults.set(response.total);
      }
    });
  }

  updateSearchQuery(newQuery: string): void {
    this._searchQuery.set(newQuery);
    this.searchSubject$.next(newQuery);
  }

  loadGenreTracks(genreId: string, genreName: string): void {
    this._searchQuery.set(genreName);
    this._isSearching.set(true);
    this._searchError.set(null);
    this.deezerApiService.fetchChartTracksByGenre(genreId).subscribe({
      next: (res) => {
        this._searchResults.set(res.data);
        this._totalResults.set(res.total);
        this._isSearching.set(false);
      },
      error: () => {
        this._searchError.set('Could not load genre tracks. Please try again.');
        this._isSearching.set(false);
      },
    });
  }

  clearSearch(): void {
    this._searchQuery.set('');
    this._searchResults.set([]);
    this._searchError.set(null);
    this._totalResults.set(0);
  }
}