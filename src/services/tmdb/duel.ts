import { tmdbFetch } from './client';
import { TMDBDiscoverResponse } from './types';
import { DEFAULT_LANGUAGE, DEFAULT_REGION } from '@/lib/constants';
import { randomElement, randomInt } from '@/lib/utils';
import { MediaType, DuelMovie, DuelPair } from '@/types';
import { fetchGenres } from './genres';

const DUEL_ROUNDS = 5;

const GENRE_PAIRS: Record<string, number[][]> = {
  movie: [
    [28, 10749],   // Action vs Romance
    [35, 27],      // Comedy vs Horror
    [878, 18],     // Sci-Fi vs Drama
    [53, 16],      // Thriller vs Animation
    [14, 80],      // Fantasy vs Crime
    [12, 36],      // Adventure vs History
    [10751, 9648], // Family vs Mystery
  ],
  tv: [
    [10759, 10749], // Action & Adventure vs Romance
    [35, 9648],     // Comedy vs Mystery
    [10765, 18],    // Sci-Fi & Fantasy vs Drama
    [80, 16],       // Crime vs Animation
    [10768, 10751], // War & Politics vs Family
    [10759, 99],    // Action & Adventure vs Documentary
    [35, 10768],    // Comedy vs War & Politics
  ],
};

export interface DuelFilterParams {
  type: MediaType;
  providers?: string;
  maxRuntime?: number;
  genres?: string;
  certification?: string;
  yearFrom?: number;
  yearTo?: number;
  actors?: string;
}

function hasSpecificFilters(params: DuelFilterParams): boolean {
  return !!(params.actors || params.certification || params.yearFrom || params.yearTo);
}

function buildFilterQuery(
  params: DuelFilterParams,
  genreOverride?: number | string,
  minVotes?: number
): Record<string, string | number | undefined> {
  const query: Record<string, string | number | undefined> = {
    language: DEFAULT_LANGUAGE,
    watch_region: DEFAULT_REGION,
    sort_by: 'vote_count.desc',
    'vote_count.gte': minVotes ?? (hasSpecificFilters(params) ? 10 : 100),
    page: 1,
  };

  if (genreOverride) {
    query.with_genres = genreOverride;
  }

  if (params.providers) {
    query.with_watch_providers = params.providers;
    query.with_watch_monetization_type = 'flatrate';
  }

  if (params.maxRuntime && params.type === 'movie') {
    query['with_runtime.lte'] = params.maxRuntime;
    query['with_runtime.gte'] = 1;
  }

  if (params.certification) {
    query.certification_country = DEFAULT_REGION;
    query['certification.lte'] = params.certification;
  }

  if (params.yearFrom) {
    if (params.type === 'movie') {
      query['primary_release_date.gte'] = `${params.yearFrom}-01-01`;
    } else {
      query['first_air_date.gte'] = `${params.yearFrom}-01-01`;
    }
  }

  if (params.yearTo) {
    if (params.type === 'movie') {
      query['primary_release_date.lte'] = `${params.yearTo}-12-31`;
    } else {
      query['first_air_date.lte'] = `${params.yearTo}-12-31`;
    }
  }

  if (params.actors) {
    if (params.type === 'movie') {
      query.with_cast = params.actors;
    } else {
      query.with_people = params.actors;
    }
  }

  return query;
}

function mapToDuelMovie(raw: TMDBDiscoverResponse['results'][number]): DuelMovie {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? 'Sem título',
    posterPath: raw.poster_path,
    releaseDate: raw.release_date ?? raw.first_air_date ?? '',
    voteAverage: raw.vote_average,
    genreIds: raw.genre_ids,
    overview: raw.overview,
  };
}

async function fetchFilteredMovie(
  params: DuelFilterParams,
  genreId: number,
  excludeIds: Set<number>
): Promise<DuelMovie | null> {
  const query = buildFilterQuery(params, genreId);

  const data = await tmdbFetch<TMDBDiscoverResponse>(
    `/discover/${params.type}`,
    query
  );

  const candidates = data.results.filter(
    (m) => m.poster_path && !excludeIds.has(m.id)
  );

  const picked = randomElement(candidates.slice(0, 15));
  if (!picked) return null;

  return mapToDuelMovie(picked);
}

async function fetchMovieFromPool(
  params: DuelFilterParams,
  page: number,
  excludeIds: Set<number>,
  genreOverride?: string
): Promise<DuelMovie | null> {
  const query = buildFilterQuery(params, genreOverride ?? params.genres);
  query.page = page;

  const data = await tmdbFetch<TMDBDiscoverResponse>(
    `/discover/${params.type}`,
    query
  );

  const candidates = data.results.filter(
    (m) => m.poster_path && !excludeIds.has(m.id)
  );

  const picked = randomElement(candidates);
  if (!picked) return null;

  return mapToDuelMovie(picked);
}

async function generatePairsFromPool(
  params: DuelFilterParams,
  genreOverride?: string
): Promise<DuelPair[]> {
  const query = buildFilterQuery(params, genreOverride ?? params.genres);
  const firstPage = await tmdbFetch<TMDBDiscoverResponse>(
    `/discover/${params.type}`,
    query
  );

  if (firstPage.total_results === 0) return [];

  const maxPage = Math.min(firstPage.total_pages, 20);
  const usedIds = new Set<number>();
  const pairs: DuelPair[] = [];

  for (let round = 0; round < DUEL_ROUNDS; round++) {
    const pageA = randomInt(1, maxPage);
    let pageB = randomInt(1, maxPage);
    if (maxPage > 1) {
      while (pageB === pageA) pageB = randomInt(1, maxPage);
    }

    const [movieA, movieB] = await Promise.all([
      fetchMovieFromPool(params, pageA, usedIds, genreOverride),
      fetchMovieFromPool(params, pageB, usedIds, genreOverride),
    ]);

    if (movieA && movieB && movieA.id !== movieB.id) {
      usedIds.add(movieA.id);
      usedIds.add(movieB.id);
      pairs.push({ optionA: movieA, optionB: movieB });
    }
  }

  return pairs;
}

async function generatePairsAcrossGenres(
  params: DuelFilterParams
): Promise<DuelPair[]> {
  const availablePairs = [...(GENRE_PAIRS[params.type] ?? GENRE_PAIRS.movie)];
  const shuffled = availablePairs.sort(() => Math.random() - 0.5);
  const selectedPairs = shuffled.slice(0, DUEL_ROUNDS + 3);

  const usedIds = new Set<number>();
  const pairs: DuelPair[] = [];

  for (const [genreA, genreB] of selectedPairs) {
    if (pairs.length >= DUEL_ROUNDS) break;

    const [movieA, movieB] = await Promise.all([
      fetchFilteredMovie(params, genreA, usedIds),
      fetchFilteredMovie(params, genreB, usedIds),
    ]);

    if (!movieA || !movieB) continue;

    usedIds.add(movieA.id);
    usedIds.add(movieB.id);
    pairs.push({ optionA: movieA, optionB: movieB });
  }

  if (pairs.length < DUEL_ROUNDS) {
    const poolPairs = await generatePairsFromPool(params);
    for (const pair of poolPairs) {
      if (pairs.length >= DUEL_ROUNDS) break;
      if (!usedIds.has(pair.optionA.id) && !usedIds.has(pair.optionB.id)) {
        usedIds.add(pair.optionA.id);
        usedIds.add(pair.optionB.id);
        pairs.push(pair);
      }
    }
  }

  if (pairs.length < DUEL_ROUNDS) {
    const genres = await fetchGenres(params.type);
    const genreIds = genres.map((g) => g.id);

    while (pairs.length < DUEL_ROUNDS && genreIds.length >= 2) {
      const idxA = Math.floor(Math.random() * genreIds.length);
      let idxB = Math.floor(Math.random() * genreIds.length);
      while (idxB === idxA) {
        idxB = Math.floor(Math.random() * genreIds.length);
      }

      const [movieA, movieB] = await Promise.all([
        fetchFilteredMovie(params, genreIds[idxA], usedIds),
        fetchFilteredMovie(params, genreIds[idxB], usedIds),
      ]);

      if (movieA && movieB) {
        usedIds.add(movieA.id);
        usedIds.add(movieB.id);
        pairs.push({ optionA: movieA, optionB: movieB });
      }

      genreIds.splice(Math.max(idxA, idxB), 1);
      genreIds.splice(Math.min(idxA, idxB), 1);
    }
  }

  return pairs;
}

export async function generateDuelPairs(
  params: DuelFilterParams
): Promise<DuelPair[]> {
  if (params.genres) {
    const pairs = await generatePairsFromPool(params);
    if (pairs.length > 0) return pairs;
  }

  const pairs = await generatePairsAcrossGenres(params);
  if (pairs.length > 0) return pairs;

  const relaxed = { ...params, actors: undefined, certification: undefined };
  return generatePairsAcrossGenres(relaxed);
}
