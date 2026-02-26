'use client';

import Image from 'next/image';
import { StreamingProvider } from '@/types';
import { useFilterStore } from '@/store/useFilterStore';
import { logoUrl } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui';

interface StreamingSelectorProps {
  providers: StreamingProvider[];
  isLoading: boolean;
}

export function StreamingSelector({ providers, isLoading }: StreamingSelectorProps) {
  const { selectedProviders, toggleProvider } = useFilterStore();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-400">Streamings</label>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="circular" className="w-12 h-12" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400">
        Streamings {selectedProviders.length > 0 && (
          <span className="text-violet-400">({selectedProviders.length})</span>
        )}
      </label>
      <div className="flex flex-wrap gap-3">
        {providers.map((provider) => {
          const isSelected = selectedProviders.includes(provider.id);
          return (
            <button
              key={provider.id}
              onClick={() => toggleProvider(provider.id)}
              aria-label={`${isSelected ? 'Remover' : 'Selecionar'} ${provider.name}`}
              aria-pressed={isSelected}
              className={cn(
                'relative w-12 h-12 rounded-xl overflow-hidden transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
                isSelected
                  ? 'ring-2 ring-violet-500 scale-110 shadow-lg shadow-violet-500/20'
                  : 'opacity-50 hover:opacity-80 hover:scale-105'
              )}
            >
              <Image
                src={logoUrl(provider.logoPath)}
                alt={provider.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
