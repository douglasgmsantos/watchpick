import { tmdbFetch } from './client';
import {
  TMDBDiscoverResponse,
  TMDBMovieDetail,
  TMDBTVDetail,
  TMDBWatchProviderResponse,
} from './types';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_REGION,
  MAX_TMDB_PAGE,
} from '@/lib/constants';
import { randomInt, randomElement } from '@/lib/utils';
import {
  MediaType,
  MediaItem,
  MediaSuggestion,
  WatchProvider,
} from '@/types';

interface DiscoverParams {
  type: MediaType;
  genres?: string;
  providers?: string;
  maxRuntime?: number;
  page?: number;
}

async function discoverMedia(
  params: DiscoverParams
): Promise<TMDBDiscoverResponse> {
  const { type, genres, providers, maxRuntime, page = 1 } = params;
  const path = `/discover/${type}`;

  const queryParams: Record<string, string | number | undefined> = {
    language: DEFAULT_LANGUAGE,
    watch_region: DEFAULT_REGION,
    sort_by: 'vote_count.desc',
    'vote_count.gte': 50,
    page,
  };

  if (genres) {
    queryParams.with_genres = genres;
  }

  if (providers) {
    queryParams.with_watch_providers = providers;
    queryParams.with_watch_monetization_type = 'flatrate';
  }

  if (maxRuntime && type === 'movie') {
    queryParams['with_runtime.lte'] = maxRuntime;
    queryParams['with_runtime.gte'] = 1;
  }

  return tmdbFetch<TMDBDiscoverResponse>(path, queryParams);
}

async function fetchRuntime(
  id: number,
  type: MediaType
): Promise<number | null> {
  if (type === 'movie') {
    const detail = await tmdbFetch<TMDBMovieDetail>(`/movie/${id}`, {
      language: DEFAULT_LANGUAGE,
    });
    return detail.runtime;
  }

  const detail = await tmdbFetch<TMDBTVDetail>(`/tv/${id}`, {
    language: DEFAULT_LANGUAGE,
  });
  return detail.episode_run_time?.[0] ?? null;
}

async function fetchWatchProviders(
  id: number,
  type: MediaType
): Promise<{ providers: WatchProvider[]; link: string | null }> {
  const path = `/${type}/${id}/watch/providers`;
  const data = await tmdbFetch<TMDBWatchProviderResponse>(path);

  const regionData = data.results[DEFAULT_REGION];
  if (!regionData?.flatrate) {
    return { providers: [], link: null };
  }

  return {
    providers: regionData.flatrate.map((p) => ({
      id: p.provider_id,
      name: p.provider_name,
      logoPath: p.logo_path,
      displayPriority: p.display_priority,
    })),
    link: regionData.link,
  };
}

function mapToMediaItem(
  raw: TMDBDiscoverResponse['results'][number],
  type: MediaType,
  runtime: number | null
): MediaItem {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? 'Sem título',
    originalTitle: raw.original_title ?? raw.original_name ?? '',
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date ?? raw.first_air_date ?? '',
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    runtime,
    mediaType: type,
    genreIds: raw.genre_ids,
  };
}

export async function getRandomSuggestion(params: {
  type: MediaType;
  genres?: string;
  providers?: string;
  maxRuntime?: number;
}): Promise<MediaSuggestion | null> {
  const firstPage = await discoverMedia({ ...params, page: 1 });

  if (firstPage.total_results === 0 || firstPage.results.length === 0) {
    return null;
  }

  const maxPage = Math.min(firstPage.total_pages, MAX_TMDB_PAGE);
  const randomPage = randomInt(1, maxPage);

  let results = firstPage.results;
  if (randomPage !== 1) {
    const page = await discoverMedia({ ...params, page: randomPage });
    results = page.results.length > 0 ? page.results : firstPage.results;
  }

  const picked = randomElement(results);
  if (!picked) return null;

  const [runtime, watchData] = await Promise.all([
    fetchRuntime(picked.id, params.type),
    fetchWatchProviders(picked.id, params.type),
  ]);

  const mediaItem = mapToMediaItem(picked, params.type, runtime);

  return {
    ...mediaItem,
    providers: watchData.providers,
    tmdbWatchLink: watchData.link,
  };
}
