'use client';

export function DuelSkeleton() {
  return (
    <div className="flex flex-col items-center gap-8 animate-pulse">
      <div className="text-center space-y-3">
        <div className="h-8 w-64 bg-white/10 rounded-lg mx-auto" />
        <div className="h-5 w-48 bg-white/5 rounded-lg mx-auto" />
      </div>

      <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-36 h-52 sm:w-44 sm:h-64 md:w-52 md:h-80 bg-white/10 rounded-xl" />
          <div className="h-5 w-28 bg-white/10 rounded" />
        </div>

        <div className="w-12 h-12 bg-white/10 rounded-full" />

        <div className="flex flex-col items-center gap-3">
          <div className="w-36 h-52 sm:w-44 sm:h-64 md:w-52 md:h-80 bg-white/10 rounded-xl" />
          <div className="h-5 w-28 bg-white/10 rounded" />
        </div>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-1.5 w-6 bg-white/10 rounded-full" />
        ))}
      </div>
    </div>
  );
}
