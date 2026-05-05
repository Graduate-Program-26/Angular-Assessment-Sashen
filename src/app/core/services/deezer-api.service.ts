import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';
import { ENVIRONMENT_CONFIG } from '@core/tokens/environment.token';
import type { DeezerTrack } from '@models/track.model';
import type { DeezerArtist } from '@models/artist.model';
import type { DeezerAlbum } from '@models/album.model';
import type { DeezerListResponse } from '@models/api-response.model';

const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_COUNT = 2;

@Injectable({ providedIn: 'root' })
export class DeezerApiService {

  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl    = inject(ENVIRONMENT_CONFIG).deezerApiBaseUrl;

  private withDefaults<T>() {
    return (source$: Observable<T>): Observable<T> =>
      source$.pipe(
        timeout(REQUEST_TIMEOUT_MS),
        retry({ count: RETRY_COUNT, delay: 1000 }),
      );
  }

  searchTracks(searchQuery: string): Observable<DeezerListResponse<DeezerTrack>> {
    return this.httpClient
      .get<DeezerListResponse<DeezerTrack>>(
        `${this.baseUrl}/search`,
        { params: { q: searchQuery } },
      )
      .pipe(this.withDefaults());
  }

  fetchArtistById(artistId: string): Observable<DeezerArtist> {
    return this.httpClient
      .get<DeezerArtist>(`${this.baseUrl}/artist/${artistId}`)
      .pipe(this.withDefaults());
  }

  fetchArtistAlbums(artistId: string): Observable<DeezerListResponse<DeezerAlbum>> {
    return this.httpClient
      .get<DeezerListResponse<DeezerAlbum>>(
        `${this.baseUrl}/artist/${artistId}/albums`
      )
      .pipe(this.withDefaults());
  }

  fetchAlbumById(albumId: string): Observable<DeezerAlbum> {
    return this.httpClient
      .get<DeezerAlbum>(`${this.baseUrl}/album/${albumId}`)
      .pipe(this.withDefaults());
  }

  fetchAlbumTracks(albumId: string): Observable<DeezerListResponse<DeezerTrack>> {
    return this.httpClient
      .get<DeezerListResponse<DeezerTrack>>(
        `${this.baseUrl}/album/${albumId}/tracks`
      )
      .pipe(this.withDefaults());
  }

  fetchTrackById(trackId: string): Observable<DeezerTrack> {
    return this.httpClient
      .get<DeezerTrack>(`${this.baseUrl}/track/${trackId}`)
      .pipe(this.withDefaults());
  }
}