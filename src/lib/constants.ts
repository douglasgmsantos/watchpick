export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const TMDB_POSTER_SIZE = 'w500';
export const TMDB_LOGO_SIZE = 'w92';
export const TMDB_BACKDROP_SIZE = 'w1280';

export const DEFAULT_REGION = 'BR';
export const DEFAULT_LANGUAGE = 'pt-BR';

export const MIN_RUNTIME = 30;
export const MAX_RUNTIME = 240;
export const DEFAULT_MAX_RUNTIME = 180;
export const RUNTIME_STEP = 10;

export const MAX_TMDB_PAGE = 500;

export function posterUrl(path: string | null): string {
  if (!path) return '/placeholder-poster.svg';
  return `${TMDB_IMAGE_BASE_URL}/${TMDB_POSTER_SIZE}${path}`;
}

export function logoUrl(path: string): string {
  return `${TMDB_IMAGE_BASE_URL}/${TMDB_LOGO_SIZE}${path}`;
}

export function backdropUrl(path: string | null): string {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}/${TMDB_BACKDROP_SIZE}${path}`;
}
