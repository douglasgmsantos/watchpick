'use client';

import { useFilterStore } from '@/store/useFilterStore';
import { Slider } from '@/components/ui';
import { MIN_RUNTIME, MAX_RUNTIME, RUNTIME_STEP } from '@/lib/constants';
import { formatRuntime } from '@/lib/utils';

export function DurationSlider() {
  const { maxRuntime, setMaxRuntime, mediaType } = useFilterStore();

  return (
    <div className="space-y-3">
      <Slider
        label={mediaType === 'movie' ? 'Duração máxima' : 'Duração do episódio (máx.)'}
        displayValue={formatRuntime(maxRuntime)}
        min={MIN_RUNTIME}
        max={MAX_RUNTIME}
        step={RUNTIME_STEP}
        value={maxRuntime}
        onChange={setMaxRuntime}
        aria-label="Ajustar duração máxima"
      />
    </div>
  );
}
