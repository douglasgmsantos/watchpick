import { MediaType } from './media';

export interface FilterState {
  selectedProviders: number[];
  selectedGenres: number[];
  mediaType: MediaType;
  maxRuntime: number;
  certification: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  selectedActors: ActorOption[];
}

export interface SuggestionParams {
  type: MediaType;
  genres?: string;
  providers?: string;
  maxRuntime?: number;
  certification?: string;
  yearFrom?: number;
  yearTo?: number;
  actors?: string;
}

export interface ActorOption {
  id: number;
  name: string;
  profilePath: string | null;
}
