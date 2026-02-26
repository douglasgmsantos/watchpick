import { tmdbFetch } from './client';
import { TMDBDiscoverResponse } from './types';
import { DEFAULT_LANGUAGE, DEFAULT_REGION } from '@/lib/constants';
import { randomElement } from '@/lib/utils';
import { MediaType, DuelMovie, DuelPair } from '@/types';
import { fetchGenres } from './genres';

const DUEL_ROUNDS = 5;

const GENRE_PAIRS: Record<string, number[][]> = {
  movie: [
    [28, 10749],  // Action vs Romance
    [35, 27],     // Comedy vs Horror
    [878, 18],    // Sci-Fi vs Drama
    [53, 16],     // Thriller vs Animation
    [14, 80],     // Fantasy vs Crime
    [12, 36],     // Adventure vs History
    [10751, 9648], // Family vs Mystery
  ],
  tv: [
    [10759, 10749], // Action & Adventure vs Romance (TV)
    [35, 9648],     // Comedy vs Mystery
    [10765, 18],    // Sci-Fi & Fantasy vs Drama
    [80, 16],       // Crime vs Animation
    [10768, 10751], // War & Politics vs Family
    [10759, 99],    // Action & Adventure vs Documentary
    [35, 10768],    // Comedy vs War & Politics
  ],
};

async function fetchPopularByGenre(
  type: MediaType,
  genreId: number,
  excludeIds: Set<number>
): Promise<DuelMovie | null> {
  const data = await tmdbFetch<TMDBDiscoverResponse>(`/discover/${type}`, {
    language: DEFAULT_LANGUAGE,
    watch_region: DEFAULT_REGION,
    sort_by: 'vote_count.desc',
    'vote_count.gte': 200,
    with_genres: genreId,
    page: 1,
  });

  const candidates = data.results.filter(
    (m) => m.poster_path && !excludeIds.has(m.id)
  );

  const picked = randomElement(candidates.slice(0, 15));
  if (!picked) return null;

  return {
    id: picked.id,
    title: picked.title ?? picked.name ?? 'Sem título',
    posterPath: picked.poster_path,
    releaseDate: picked.release_date ?? picked.first_air_date ?? '',
    voteAverage: picked.vote_average,
    genreIds: picked.genre_ids,
    overview: picked.overview,
  };
}

export async function generateDuelPairs(
  type: MediaType
): Promise<DuelPair[]> {
  const availablePairs = [...(GENRE_PAIRS[type] ?? GENRE_PAIRS.movie)];

  const shuffled = availablePairs.sort(() => Math.random() - 0.5);
  const selectedPairs = shuffled.slice(0, DUEL_ROUNDS);

  const usedIds = new Set<number>();
  const pairs: DuelPair[] = [];

  for (const [genreA, genreB] of selectedPairs) {
    const [movieA, movieB] = await Promise.all([
      fetchPopularByGenre(type, genreA, usedIds),
      fetchPopularByGenre(type, genreB, usedIds),
    ]);

    if (!movieA || !movieB) continue;

    usedIds.add(movieA.id);
    usedIds.add(movieB.id);

    pairs.push({ optionA: movieA, optionB: movieB });
  }

  if (pairs.length < DUEL_ROUNDS) {
    const genres = await fetchGenres(type);
    const genreIds = genres.map((g) => g.id);

    while (pairs.length < DUEL_ROUNDS && genreIds.length >= 2) {
      const idxA = Math.floor(Math.random() * genreIds.length);
      let idxB = Math.floor(Math.random() * genreIds.length);
      while (idxB === idxA) {
        idxB = Math.floor(Math.random() * genreIds.length);
      }

      const [movieA, movieB] = await Promise.all([
        fetchPopularByGenre(type, genreIds[idxA], usedIds),
        fetchPopularByGenre(type, genreIds[idxB], usedIds),
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
