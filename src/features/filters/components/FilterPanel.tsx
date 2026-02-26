'use client';

import { useFilters } from '../hooks/useFilters';
import { StreamingSelector } from './StreamingSelector';
import { GenreSelector } from './GenreSelector';
import { TypeToggle } from './TypeToggle';
import { DurationSlider } from './DurationSlider';
import { Card, Button } from '@/components/ui';
import { useFilterStore } from '@/store/useFilterStore';

interface FilterPanelProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function FilterPanel({ onSubmit, isSubmitting }: FilterPanelProps) {
  const { genres, providers, isLoading, error } = useFilters();
  const { reset } = useFilterStore();

  return (
    <Card className="w-full max-w-xl p-6 md:p-8 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white">O que vamos assistir?</h2>
        <p className="text-sm text-gray-400">Escolha seus filtros e deixe o resto com a gente.</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      <TypeToggle />
      <StreamingSelector providers={providers} isLoading={isLoading} />
      <GenreSelector genres={genres} isLoading={isLoading} />
      <DurationSlider />

      <div className="flex flex-col gap-3 pt-2">
        <Button
          size="lg"
          onClick={onSubmit}
          isLoading={isSubmitting}
          disabled={isLoading}
          className="w-full"
        >
          Escolher por nós
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="self-center"
        >
          Limpar filtros
        </Button>
      </div>
    </Card>
  );
}
