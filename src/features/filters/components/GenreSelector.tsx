'use client';

import { Genre } from '@/types';
import { useFilterStore } from '@/store/useFilterStore';
import { Select, Skeleton } from '@/components/ui';

interface GenreSelectorProps {
  genres: Genre[];
  isLoading: boolean;
}

export function GenreSelector({ genres, isLoading }: GenreSelectorProps) {
  const { selectedGenre, setGenre } = useFilterStore();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-400">Gênero</label>
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  const options = genres.map((g) => ({
    value: String(g.id),
    label: g.name,
  }));

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400">Gênero</label>
      <Select
        options={options}
        placeholder="Todos os gêneros"
        value={selectedGenre ? String(selectedGenre) : ''}
        onChange={(val) => setGenre(val ? Number(val) : null)}
        aria-label="Selecionar gênero"
      />
    </div>
  );
}
