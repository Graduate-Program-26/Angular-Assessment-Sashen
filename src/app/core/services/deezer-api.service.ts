import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, retry, timeout } from 'rxjs/operators';
import { ENVIRONMENT_CONFIG } from '@core/tokens/environment.token';
import type { Track } from '@models/track.model';

/** Deezer wraps errors in a 200 response body */
interface DeezerErrorBody {
  error: { type: string; message: string; code: number };
}

export interface DeezerArtist {
  readonly id:             number;
  readonly name:           string;
  readonly picture_medium: string;
  readonly nb_fan:         number;
  readonly nb_album:       number;
}

export interface DeezerSearchResult {
  readonly data:  Track[];
  readonly total: number;
  readonly next?: string;
}

@Injectable({ providedIn: 'root' })
export class DeezerApiService {
  private readonly http    = inject(HttpClient);
  private readonly env     = inject(ENVIRONMENT_CONFIG);
  private readonly baseUrl = this.env.deezerApiBaseUrl;

  private throwIfDeezerError<T>() {
    return map((res: T | DeezerErrorBody): T => {
      if (res && typeof res === 'object' && 'error' in res) {
        const err = (res as DeezerErrorBody).error;
        throw new Error(`Deezer error ${err.code}: ${err.message}`);
      }
      return res as T;
    });
  }

  /** Applies a request timeout and one automatic retry */
  private withDefaults<T>() {
    return (source: Observable<T>): Observable<T> =>
      source.pipe(timeout(10_000), retry(1));
  }

  fetchArtistById(artistId: string): Observable<DeezerArtist> {
    return this.http
      .get<DeezerArtist | DeezerErrorBody>(`${this.baseUrl}/artist/${artistId}`)
      .pipe(this.throwIfDeezerError(), this.withDefaults());
  }

  search(query: string): Observable<DeezerSearchResult> {
    return this.http
      .get<DeezerSearchResult | DeezerErrorBody>(`${this.baseUrl}/search`, {
        params: { q: query },
      })
      .pipe(this.throwIfDeezerError(), this.withDefaults());
  }
}
