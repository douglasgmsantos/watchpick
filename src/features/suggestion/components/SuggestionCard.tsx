'use client';

import Image from 'next/image';
import { MediaSuggestion } from '@/types';
import { posterUrl, logoUrl } from '@/lib/constants';
import { formatRuntime } from '@/lib/utils';
import { Card, Button } from '@/components/ui';

interface SuggestionCardProps {
  suggestion: MediaSuggestion;
  onChooseAnother: () => void;
  onBack: () => void;
  isLoading: boolean;
}

function RatingBadge({ rating }: { rating: number }) {
  const color =
    rating >= 7 ? 'bg-green-500/20 text-green-400' :
    rating >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
    'bg-red-500/20 text-red-400';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-sm font-semibold ${color}`}>
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {rating.toFixed(1)}
    </span>
  );
}

export function SuggestionCard({ suggestion, onChooseAnother, onBack, isLoading }: SuggestionCardProps) {
  const year = suggestion.releaseDate
    ? new Date(suggestion.releaseDate).getFullYear()
    : null;

  return (
    <Card className="w-full max-w-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-72 sm:h-auto shrink-0">
          <Image
            src={posterUrl(suggestion.posterPath)}
            alt={`Poster de ${suggestion.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 192px"
            priority
          />
        </div>

        <div className="flex-1 p-6 space-y-3">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">
              {suggestion.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {year && <span className="text-sm text-gray-400">{year}</span>}
              {suggestion.runtime && (
                <>
                  <span className="text-gray-600">·</span>
                  <span className="text-sm text-gray-400">
                    {formatRuntime(suggestion.runtime)}
                  </span>
                </>
              )}
              <RatingBadge rating={suggestion.voteAverage} />
            </div>
          </div>

          {suggestion.overview && (
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">
              {suggestion.overview}
            </p>
          )}

          {suggestion.providers.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Onde assistir
              </span>
              <div className="flex gap-2 flex-wrap">
                {suggestion.providers.map((provider) => (
                  <Image
                    key={provider.id}
                    src={logoUrl(provider.logoPath)}
                    alt={provider.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={onChooseAnother}
              isLoading={isLoading}
              className="w-full"
            >
              Escolher outro
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="self-center"
            >
              Voltar aos filtros
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
