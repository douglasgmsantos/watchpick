'use client';

import { useState, useEffect, useCallback } from 'react';
import { DuelPair, DuelChoice } from '@/types';
import { DuelMovieCard } from './DuelMovieCard';
import { DuelProgress } from './DuelProgress';
import { DuelSkeleton } from './DuelSkeleton';
import { Button } from '@/components/ui';

interface DuelFlowProps {
  pairs: DuelPair[];
  isLoading: boolean;
  error: string | null;
  onComplete: (choices: DuelChoice[]) => void;
  onBack: () => void;
}

export function DuelFlow({ pairs, isLoading, error, onComplete, onBack }: DuelFlowProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [choices, setChoices] = useState<DuelChoice[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [roundKey, setRoundKey] = useState(0);

  const totalRounds = pairs.length;
  const currentPair = pairs[currentRound];

  useEffect(() => {
    setCurrentRound(0);
    setChoices([]);
    setRoundKey(0);
  }, [pairs]);

  const handleChoice = useCallback((movie: DuelPair['optionA']) => {
    if (isTransitioning) return;

    const choice: DuelChoice = {
      movieId: movie.id,
      genreIds: movie.genreIds,
    };

    const newChoices = [...choices, choice];
    setChoices(newChoices);

    if (currentRound + 1 >= totalRounds) {
      setIsTransitioning(true);
      setTimeout(() => {
        onComplete(newChoices);
      }, 600);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentRound((prev) => prev + 1);
      setRoundKey((prev) => prev + 1);
      setIsTransitioning(false);
    }, 400);
  }, [choices, currentRound, totalRounds, onComplete, isTransitioning]);

  if (isLoading) {
    return <DuelSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Ops!</h2>
          <p className="text-gray-400">{error}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  if (!currentPair) return null;

  return (
    <div className={`flex flex-col items-center gap-6 sm:gap-8 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-violet-400 uppercase tracking-wider">
          Rodada {currentRound + 1} de {totalRounds}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Qual você prefere?
        </h2>
      </div>

      <div key={roundKey} className="flex items-center gap-3 sm:gap-6 md:gap-10">
        <DuelMovieCard
          movie={currentPair.optionA}
          onSelect={() => handleChoice(currentPair.optionA)}
          side="left"
        />

        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-lg sm:text-xl font-black text-white/30 select-none">
            VS
          </span>
        </div>

        <DuelMovieCard
          movie={currentPair.optionB}
          onSelect={() => handleChoice(currentPair.optionB)}
          side="right"
        />
      </div>

      <DuelProgress current={currentRound} total={totalRounds} />

      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
      >
        Pular e ir direto
      </Button>
    </div>
  );
}
