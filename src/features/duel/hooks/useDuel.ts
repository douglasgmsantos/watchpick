'use client';

import { useState, useCallback } from 'react';
import { getDuelPairs } from '@/services/api';
import { useFilterStore } from '@/store/useFilterStore';
import { DuelPair, DuelChoice } from '@/types';

interface UseDuelReturn {
  pairs: DuelPair[];
  choices: DuelChoice[];
  currentRound: number;
  totalRounds: number;
  isLoading: boolean;
  error: string | null;
  isComplete: boolean;
  startDuel: () => Promise<void>;
  makeChoice: (choice: DuelChoice) => void;
  getPreferredGenres: () => number[];
  reset: () => void;
}

export function useDuel(): UseDuelReturn {
  const [pairs, setPairs] = useState<DuelPair[]>([]);
  const [choices, setChoices] = useState<DuelChoice[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    mediaType, selectedProviders, maxRuntime, selectedGenres,
    certification, yearFrom, yearTo, selectedActors,
  } = useFilterStore();

  const totalRounds = pairs.length;
  const isComplete = totalRounds > 0 && currentRound >= totalRounds;

  const startDuel = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setChoices([]);
    setCurrentRound(0);

    try {
      const duelPairs = await getDuelPairs({
        type: mediaType,
        providers: selectedProviders.length > 0
          ? selectedProviders.join('|')
          : undefined,
        maxRuntime: String(maxRuntime),
        genres: selectedGenres.length > 0
          ? selectedGenres.join(',')
          : undefined,
        certification: certification ?? undefined,
        yearFrom: yearFrom ? String(yearFrom) : undefined,
        yearTo: yearTo ? String(yearTo) : undefined,
        actors: selectedActors.length > 0
          ? selectedActors.map((a) => a.id).join(',')
          : undefined,
      });
      setPairs(duelPairs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [mediaType, selectedProviders, maxRuntime, selectedGenres, certification, yearFrom, yearTo, selectedActors]);

  const makeChoice = useCallback((choice: DuelChoice) => {
    setChoices((prev) => [...prev, choice]);
    setCurrentRound((prev) => prev + 1);
  }, []);

  const getPreferredGenres = useCallback(() => {
    const genreCount = new Map<number, number>();
    for (const choice of choices) {
      for (const genreId of choice.genreIds) {
        genreCount.set(genreId, (genreCount.get(genreId) ?? 0) + 1);
      }
    }

    return Array.from(genreCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genreId]) => genreId);
  }, [choices]);

  const reset = useCallback(() => {
    setPairs([]);
    setChoices([]);
    setCurrentRound(0);
    setError(null);
  }, []);

  return {
    pairs,
    choices,
    currentRound,
    totalRounds,
    isLoading,
    error,
    isComplete,
    startDuel,
    makeChoice,
    getPreferredGenres,
    reset,
  };
}
