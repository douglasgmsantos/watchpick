'use client';

import { useEffect, useState } from 'react';
import { getGenres, getProviders } from '@/services/api';
import { useFilterStore } from '@/store/useFilterStore';
import { Genre, StreamingProvider } from '@/types';

export function useFilters() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [providers, setProviders] = useState<StreamingProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mediaType } = useFilterStore();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const [genreData, providerData] = await Promise.all([
          getGenres(mediaType),
          getProviders(mediaType),
        ]);

        if (!cancelled) {
          setGenres(genreData);
          setProviders(providerData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar filtros');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [mediaType]);

  return { genres, providers, isLoading, error };
}
