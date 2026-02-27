'use client';

import { useState, useCallback, useRef } from 'react';
import { getSuggestion } from '@/services/api';
import { useFilterStore } from '@/store/useFilterStore';
import { MediaSuggestion } from '@/types';

interface UseSuggestionReturn {
  suggestion: MediaSuggestion | null;
  isLoading: boolean;
  error: string | null;
  fetchSuggestion: (preferredGenres?: number[]) => Promise<void>;
  clear: () => void;
}

export function useSuggestion(): UseSuggestionReturn {
  const [suggestion, setSuggestion] = useState<MediaSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastPreferredGenres = useRef<number[]>([]);

  const {
    mediaType, selectedGenres, selectedProviders, maxRuntime,
    certification, yearFrom, yearTo, selectedActors,
  } = useFilterStore();

  const fetchSuggestion = useCallback(async (preferredGenres?: number[]) => {
    setIsLoading(true);
    setError(null);

    if (preferredGenres) {
      lastPreferredGenres.current = preferredGenres;
    }

    const duelGenres = preferredGenres ?? lastPreferredGenres.current;

    try {
      const genreParts: number[] = [...selectedGenres];
      for (const g of duelGenres) {
        if (!genreParts.includes(g)) genreParts.push(g);
      }

      const genres = genreParts.length > 0
        ? genreParts.join(',')
        : undefined;

      const result = await getSuggestion({
        type: mediaType,
        genres,
        providers: selectedProviders.length > 0
          ? selectedProviders.join('|')
          : undefined,
        maxRuntime: String(maxRuntime),
        preferredGenres: duelGenres.length > 0
          ? duelGenres.join(',')
          : undefined,
        certification: certification ?? undefined,
        yearFrom: yearFrom ? String(yearFrom) : undefined,
        yearTo: yearTo ? String(yearTo) : undefined,
        actors: selectedActors.length > 0
          ? selectedActors.map((a) => a.id).join(',')
          : undefined,
      });

      setSuggestion(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado';
      setError(message);
      setSuggestion(null);
    } finally {
      setIsLoading(false);
    }
  }, [mediaType, selectedGenres, selectedProviders, maxRuntime, certification, yearFrom, yearTo, selectedActors]);

  const clear = useCallback(() => {
    setSuggestion(null);
    setError(null);
    lastPreferredGenres.current = [];
  }, []);

  return { suggestion, isLoading, error, fetchSuggestion, clear };
}
