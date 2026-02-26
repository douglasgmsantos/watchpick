import { tmdbFetch } from './client';
import { TMDBProviderListResponse } from './types';
import { DEFAULT_LANGUAGE, DEFAULT_REGION } from '@/lib/constants';
import { StreamingProvider, MediaType } from '@/types';

export async function fetchProviders(type: MediaType): Promise<StreamingProvider[]> {
  const path = `/watch/providers/${type === 'movie' ? 'movie' : 'tv'}`;
  const data = await tmdbFetch<TMDBProviderListResponse>(path, {
    language: DEFAULT_LANGUAGE,
    watch_region: DEFAULT_REGION,
  }, { revalidate: 86400 });

  return data.results
    .filter((p) => p.logo_path)
    .map((p) => ({
      id: p.provider_id,
      name: p.provider_name,
      logoPath: p.logo_path,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
