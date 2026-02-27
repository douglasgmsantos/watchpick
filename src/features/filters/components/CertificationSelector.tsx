'use client';

import { useFilterStore } from '@/store/useFilterStore';
import { CERTIFICATIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function CertificationSelector() {
  const { certification, setCertification } = useFilterStore();

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400">Classificação indicativa</label>
      <div className="flex flex-wrap gap-2">
        {CERTIFICATIONS.map((cert) => {
          const isSelected = certification === cert;
          return (
            <button
              key={cert}
              onClick={() => setCertification(isSelected ? null : cert)}
              aria-pressed={isSelected}
              className={cn(
                'min-w-[3rem] px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
                isSelected
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              )}
            >
              {cert}
            </button>
          );
        })}
      </div>
    </div>
  );
}
