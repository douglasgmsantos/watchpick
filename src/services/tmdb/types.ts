export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenreListResponse {
  genres: TMDBGenre[];
}

export interface TMDBProvider {
  display_priorities: Record<string, number>;
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: number;
}

export interface TMDBProviderListResponse {
  results: TMDBProvider[];
}

export interface TMDBDiscoverResult {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TMDBDiscoverResponse {
  page: number;
  results: TMDBDiscoverResult[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetail {
  id: number;
  runtime: number | null;
}

export interface TMDBTVDetail {
  id: number;
  episode_run_time: number[];
}

export interface TMDBWatchProviderEntry {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface TMDBWatchProviderCountry {
  link: string;
  flatrate?: TMDBWatchProviderEntry[];
  rent?: TMDBWatchProviderEntry[];
  buy?: TMDBWatchProviderEntry[];
}

export interface TMDBWatchProviderResponse {
  id: number;
  results: Record<string, TMDBWatchProviderCountry>;
}
