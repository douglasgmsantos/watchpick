'use client';

import { useState, useCallback } from 'react';
import { FilterPanel } from '@/features/filters/components/FilterPanel';
import { SuggestionCard } from '@/features/suggestion/components/SuggestionCard';
import { SuggestionSkeleton } from '@/features/suggestion/components/SuggestionSkeleton';
import { EmptyState } from '@/features/suggestion/components/EmptyState';
import { DuelFlow } from '@/features/duel/components/DuelFlow';
import { useSuggestion } from '@/features/suggestion/hooks/useSuggestion';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getDuelPairs } from '@/services/api';
import { useFilterStore } from '@/store/useFilterStore';
import { DuelPair, DuelChoice } from '@/types';

type View = 'filters' | 'duel' | 'result';

export function HomeContent() {
  const [view, setView] = useState<View>('filters');
  const { suggestion, isLoading, error, fetchSuggestion, clear } = useSuggestion();

  const [duelPairs, setDuelPairs] = useState<DuelPair[]>([]);
  const [duelLoading, setDuelLoading] = useState(false);
  const [duelError, setDuelError] = useState<string | null>(null);

  const { mediaType } = useFilterStore();

  const handleSubmit = useCallback(async () => {
    setDuelLoading(true);
    setDuelError(null);
    setView('duel');

    try {
      const pairs = await getDuelPairs(mediaType);
      setDuelPairs(pairs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado';
      setDuelError(message);
    } finally {
      setDuelLoading(false);
    }
  }, [mediaType]);

  const handleDuelComplete = useCallback(async (choices: DuelChoice[]) => {
    const genreCount = new Map<number, number>();
    for (const choice of choices) {
      for (const genreId of choice.genreIds) {
        genreCount.set(genreId, (genreCount.get(genreId) ?? 0) + 1);
      }
    }

    const preferredGenres = Array.from(genreCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genreId]) => genreId);

    setView('result');
    await fetchSuggestion(preferredGenres);
  }, [fetchSuggestion]);

  const handleDuelSkip = useCallback(async () => {
    setView('result');
    await fetchSuggestion();
  }, [fetchSuggestion]);

  const handleChooseAnother = useCallback(async () => {
    await fetchSuggestion();
  }, [fetchSuggestion]);

  const handleBack = useCallback(() => {
    clear();
    setDuelPairs([]);
    setDuelError(null);
    setView('filters');
  }, [clear]);

  return (
    <ErrorBoundary>
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full flex flex-col items-center gap-8">
          {view === 'filters' && (
            <>
              <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  Não sabe o que assistir?
                </h1>
                <p className="text-lg text-gray-400 max-w-md mx-auto">
                  Selecione seus filtros e deixe a gente escolher por você.
                </p>
              </div>
              <FilterPanel onSubmit={handleSubmit} isSubmitting={duelLoading} />
            </>
          )}

          {view === 'duel' && (
            <DuelFlow
              pairs={duelPairs}
              isLoading={duelLoading}
              error={duelError}
              onComplete={handleDuelComplete}
              onBack={handleDuelSkip}
            />
          )}

          {view === 'result' && (
            <>
              {isLoading && <SuggestionSkeleton />}

              {!isLoading && error && (
                <EmptyState
                  message={error}
                  onRetry={handleChooseAnother}
                  onBack={handleBack}
                />
              )}

              {!isLoading && !error && suggestion && (
                <SuggestionCard
                  suggestion={suggestion}
                  onChooseAnother={handleChooseAnother}
                  onBack={handleBack}
                  isLoading={isLoading}
                />
              )}

              {!isLoading && !error && !suggestion && (
                <EmptyState
                  message="Nenhum título encontrado com esses filtros. Tente mudar o gênero ou adicionar mais streamings."
                  onRetry={handleChooseAnother}
                  onBack={handleBack}
                />
              )}
            </>
          )}
        </div>
      </main>
    </ErrorBoundary>
  );
}
