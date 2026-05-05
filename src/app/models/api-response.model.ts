export interface DeezerListResponse<T> {
  readonly data:  readonly T[];
  readonly total: number;
  readonly next:  string | undefined;
  readonly prev:  string | undefined;
}