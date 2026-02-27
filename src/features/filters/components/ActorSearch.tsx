'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useFilterStore } from '@/store/useFilterStore';
import { searchActors } from '@/services/api';
import { ActorOption } from '@/types/filters';
import { TMDB_IMAGE_BASE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

function actorPhoto(path: string | null): string {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}/w45${path}`;
}

export function ActorSearch() {
  const { selectedActors, addActor, removeActor } = useFilterStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ActorOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const data = await searchActors(q);
      setResults(data.filter((a) => !selectedActors.some((s) => s.id === a.id)));
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [selectedActors]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (actor: ActorOption) => {
    addActor(actor);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400">
        Atores {selectedActors.length > 0 && (
          <span className="text-violet-400">({selectedActors.length})</span>
        )}
      </label>

      {selectedActors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedActors.map((actor) => (
            <span
              key={actor.id}
              className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 text-sm"
            >
              {actor.profilePath ? (
                <Image
                  src={actorPhoto(actor.profilePath)}
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gray-400">
                  {actor.name[0]}
                </span>
              )}
              {actor.name}
              <button
                onClick={() => removeActor(actor.id)}
                className="ml-0.5 hover:text-white transition-colors"
                aria-label={`Remover ${actor.name}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <div ref={containerRef} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar ator..."
          className={cn(
            'w-full h-10 px-4 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
            'transition-all duration-200'
          )}
        />

        {isOpen && (results.length > 0 || isSearching) && (
          <div className="absolute z-50 mt-1.5 w-full max-h-56 overflow-y-auto rounded-xl bg-gray-900 border border-white/10 shadow-2xl shadow-black/50">
            {isSearching && results.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">Buscando...</div>
            )}
            {results.map((actor) => (
              <button
                key={actor.id}
                onClick={() => handleSelect(actor)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors"
              >
                {actor.profilePath ? (
                  <Image
                    src={actorPhoto(actor.profilePath)}
                    alt=""
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-gray-400 shrink-0">
                    {actor.name[0]}
                  </span>
                )}
                <span className="text-sm text-white truncate">{actor.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
