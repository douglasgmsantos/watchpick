'use client';

import Image from 'next/image';
import { DuelMovie } from '@/types';
import { posterUrl } from '@/lib/constants';

interface DuelMovieCardProps {
  movie: DuelMovie;
  onSelect: () => void;
  side: 'left' | 'right';
}

export function DuelMovieCard({ movie, onSelect, side }: DuelMovieCardProps) {
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <button
      onClick={onSelect}
      className={`
        group relative flex flex-col items-center gap-3 p-3 rounded-2xl
        transition-all duration-300 ease-out
        hover:scale-[1.03] hover:bg-white/10
        active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
        cursor-pointer w-full
        ${side === 'left' ? 'animate-in fade-in slide-in-from-left' : 'animate-in fade-in slide-in-from-right'}
      `}
    >
      <div className="relative w-36 h-52 sm:w-44 sm:h-64 md:w-52 md:h-80 rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-2 ring-white/10 group-hover:ring-violet-500/50 transition-all duration-300">
        <Image
          src={posterUrl(movie.posterPath)}
          alt={`Poster de ${movie.title}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="text-center space-y-1 max-w-[13rem]">
        <h3 className="text-sm sm:text-base font-bold text-white leading-tight line-clamp-2 group-hover:text-violet-300 transition-colors">
          {movie.title}
        </h3>
        {year && (
          <p className="text-xs text-gray-500">{year}</p>
        )}
      </div>
    </button>
  );
}
