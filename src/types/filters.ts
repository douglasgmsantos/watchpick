import { MediaType } from './media';

export interface FilterState {
  selectedProviders: number[];
  selectedGenre: number | null;
  mediaType: MediaType;
  maxRuntime: number;
}

export interface SuggestionParams {
  type: MediaType;
  genres?: string;
  providers?: string;
  maxRuntime?: number;
}
