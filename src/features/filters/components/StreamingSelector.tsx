'use client';

import { useState } from 'react';
import Image from 'next/image';
import { StreamingProvider } from '@/types';
import { useFilterStore } from '@/store/useFilterStore';
import { logoUrl } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui';

const VISIBLE_COUNT = 7;

interface StreamingSelectorProps {
  providers: StreamingProvider[];
  isLoading: boolean;
}

function getAllIds(provider: StreamingProvider): number[] {
  return provider.variantIds ?? [provider.id];
}

export function StreamingSelector({ providers, isLoading }: StreamingSelectorProps) {
  const { selectedProviders, setProviders } = useFilterStore();
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-400">Streamings</label>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: VISIBLE_COUNT }).map((_, i) => (
            <Skeleton key={i} variant="circular" className="w-12 h-12" />
          ))}
        </div>
      </div>
    );
  }

  const visibleProviders = expanded ? providers : providers.slice(0, VISIBLE_COUNT);
  const hasMore = providers.length > VISIBLE_COUNT;

  const selectedCount = providers.filter((p) => {
    const ids = getAllIds(p);
    return ids.some((id) => selectedProviders.includes(id));
  }).length;

  const toggleProvider = (provider: StreamingProvider) => {
    const ids = getAllIds(provider);
    const isSelected = ids.some((id) => selectedProviders.includes(id));

    if (isSelected) {
      setProviders(selectedProviders.filter((id) => !ids.includes(id)));
    } else {
      setProviders([...selectedProviders, ...ids]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400">
        Streamings {selectedCount > 0 && (
          <span className="text-violet-400">({selectedCount})</span>
        )}
      </label>
      <div className="flex flex-wrap gap-3">
        {visibleProviders.map((provider) => {
          const ids = getAllIds(provider);
          const isSelected = ids.some((id) => selectedProviders.includes(id));
          return (
            <button
              key={provider.id}
              onClick={() => toggleProvider(provider)}
              aria-label={`${isSelected ? 'Remover' : 'Selecionar'} ${provider.name}`}
              aria-pressed={isSelected}
              className={cn(
                'relative w-12 h-12 rounded-xl overflow-hidden transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
                isSelected
                  ? 'ring-2 ring-violet-500 scale-110 shadow-lg shadow-violet-500/20'
                  : 'opacity-50 hover:opacity-80 hover:scale-105'
              )}
              title={provider.name}
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

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
        >
          {expanded ? 'Ver menos' : `Ver mais (${providers.length - VISIBLE_COUNT})`}
        </button>
      )}
    </div>
  );
}
