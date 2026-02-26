'use client';

import { useFilterStore } from '@/store/useFilterStore';
import { Toggle } from '@/components/ui';
import { MediaType } from '@/types';

const typeOptions = [
  { value: 'movie' as const, label: 'Filme' },
  { value: 'tv' as const, label: 'Série' },
];

export function TypeToggle() {
  const { mediaType, setMediaType } = useFilterStore();

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400">Tipo</label>
      <Toggle<MediaType>
        options={typeOptions}
        value={mediaType}
        onChange={setMediaType}
        className="w-full"
      />
    </div>
  );
}
