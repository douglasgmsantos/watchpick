import { tmdbFetch } from './client';
import { DEFAULT_LANGUAGE } from '@/lib/constants';
import { ActorOption } from '@/types/filters';

interface TMDBPersonResult {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
}

interface TMDBPersonSearchResponse {
  results: TMDBPersonResult[];
  total_results: number;
}

export async function searchActors(query: string): Promise<ActorOption[]> {
  if (!query || query.length < 2) return [];

  const data = await tmdbFetch<TMDBPersonSearchResponse>('/search/person', {
    language: DEFAULT_LANGUAGE,
    query,
    page: 1,
  });

  return data.results
    .filter((p) => p.known_for_department === 'Acting')
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      name: p.name,
      profilePath: p.profile_path,
    }));
}
