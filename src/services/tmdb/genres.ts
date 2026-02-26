import { tmdbFetch } from './client';
import { TMDBGenreListResponse } from './types';
import { DEFAULT_LANGUAGE } from '@/lib/constants';
import { Genre, MediaType } from '@/types';

export async function fetchGenres(type: MediaType): Promise<Genre[]> {
  const path = `/genre/${type}/list`;
  const data = await tmdbFetch<TMDBGenreListResponse>(path, {
    language: DEFAULT_LANGUAGE,
  }, { revalidate: 86400 });

  return data.genres.map((g) => ({
    id: g.id,
    name: g.name,
  }));
}
