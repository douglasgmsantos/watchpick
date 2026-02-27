'use client';

import { Genre } from '@/types';
import { useFilterStore } from '@/store/useFilterStore';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

interface GenreSelectorProps {
  genres: Genre[];
  isLoading: boolean;
}

export function GenreSelector({ genres, isLoading }: GenreSelectorProps) {
  const { selectedGenres, toggleGenre } = useFilterStore();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-400">Gêneros</label>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400">
        Gêneros {selectedGenres.length > 0 && (
          <span className="text-violet-400">({selectedGenres.length})</span>
        )}
      </label>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id);
          return (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              aria-pressed={isSelected}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
                isSelected
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              )}
            >
              {genre.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
