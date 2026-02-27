import { Genre, MediaSuggestion, MediaType, StreamingProvider, DuelPair } from '@/types';
import { ActorOption } from '@/types/filters';

const BASE_URL = '/api';

async function apiFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(path, window.location.origin);
  url.pathname = `${BASE_URL}${path}`;

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getGenres(type: MediaType): Promise<Genre[]> {
  return apiFetch<Genre[]>('/genres', { type });
}

export async function getProviders(type: MediaType): Promise<StreamingProvider[]> {
  return apiFetch<StreamingProvider[]>('/providers', { type });
}

export async function searchActors(query: string): Promise<ActorOption[]> {
  return apiFetch<ActorOption[]>('/actors', { query });
}

export async function getSuggestion(params: {
  type: MediaType;
  genres?: string;
  providers?: string;
  maxRuntime?: string;
  preferredGenres?: string;
  certification?: string;
  yearFrom?: string;
  yearTo?: string;
  actors?: string;
}): Promise<MediaSuggestion | null> {
  const queryParams: Record<string, string> = { type: params.type };
  if (params.genres) queryParams.genres = params.genres;
  if (params.providers) queryParams.providers = params.providers;
  if (params.maxRuntime) queryParams.maxRuntime = params.maxRuntime;
  if (params.preferredGenres) queryParams.preferredGenres = params.preferredGenres;
  if (params.certification) queryParams.certification = params.certification;
  if (params.yearFrom) queryParams.yearFrom = params.yearFrom;
  if (params.yearTo) queryParams.yearTo = params.yearTo;
  if (params.actors) queryParams.actors = params.actors;

  return apiFetch<MediaSuggestion | null>('/suggestion', queryParams);
}

export async function getDuelPairs(params: {
  type: MediaType;
  providers?: string;
  maxRuntime?: string;
  genres?: string;
  certification?: string;
  yearFrom?: string;
  yearTo?: string;
  actors?: string;
}): Promise<DuelPair[]> {
  const queryParams: Record<string, string> = { type: params.type };
  if (params.providers) queryParams.providers = params.providers;
  if (params.maxRuntime) queryParams.maxRuntime = params.maxRuntime;
  if (params.genres) queryParams.genres = params.genres;
  if (params.certification) queryParams.certification = params.certification;
  if (params.yearFrom) queryParams.yearFrom = params.yearFrom;
  if (params.yearTo) queryParams.yearTo = params.yearTo;
  if (params.actors) queryParams.actors = params.actors;

  const data = await apiFetch<{ pairs: DuelPair[] }>('/duel', queryParams);
  return data.pairs;
}
