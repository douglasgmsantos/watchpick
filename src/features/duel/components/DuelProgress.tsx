'use client';

interface DuelProgressProps {
  current: number;
  total: number;
}

export function DuelProgress({ current, total }: DuelProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`
            h-1.5 rounded-full transition-all duration-500 ease-out
            ${i < current
              ? 'bg-violet-500 w-8'
              : i === current
                ? 'bg-violet-400 w-8 animate-pulse'
                : 'bg-white/15 w-6'
            }
          `}
        />
      ))}
    </div>
  );
}
