'use client';

import { useState, useCallback } from 'react';
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

  const { mediaType, selectedGenre, selectedProviders, maxRuntime } = useFilterStore();

  const fetchSuggestion = useCallback(async (preferredGenres?: number[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const genres = selectedGenre
        ? String(selectedGenre)
        : preferredGenres?.length
          ? preferredGenres.join(',')
          : undefined;

      const result = await getSuggestion({
        type: mediaType,
        genres,
        providers: selectedProviders.length > 0
          ? selectedProviders.join('|')
          : undefined,
        maxRuntime: String(maxRuntime),
        preferredGenres: preferredGenres?.length
          ? preferredGenres.join(',')
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
  }, [mediaType, selectedGenre, selectedProviders, maxRuntime]);

  const clear = useCallback(() => {
    setSuggestion(null);
    setError(null);
  }, []);

  return { suggestion, isLoading, error, fetchSuggestion, clear };
}
