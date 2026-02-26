export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  runtime: number | null;
  mediaType: MediaType;
  genreIds: number[];
}

export interface MediaSuggestion extends MediaItem {
  providers: WatchProvider[];
  tmdbWatchLink: string | null;
}

export interface WatchProvider {
  id: number;
  name: string;
  logoPath: string;
  displayPriority: number;
}

export interface DuelMovie {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  genreIds: number[];
  overview: string;
}

export interface DuelPair {
  optionA: DuelMovie;
  optionB: DuelMovie;
}

export interface DuelChoice {
  movieId: number;
  genreIds: number[];
}
