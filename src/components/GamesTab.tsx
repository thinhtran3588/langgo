'use client';

import { useState } from 'react';
import FlashcardGame from '@/components/FlashcardGame';
import MultipleChoiceGame from '@/components/MultipleChoiceGame';

type GameOption = 'flashcard' | 'multiple-choice' | undefined;

type GamesTabProps = {
  words: Array<{
    word: string;
    type?: string;
    pronunciation?: string;
    translation?: string;
  }>;
  storageKey?: string;
};

const GamesTab = ({ words, storageKey }: GamesTabProps) => {
  const [activeGame, setActiveGame] = useState<GameOption>(undefined);

  if (activeGame === 'flashcard') {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setActiveGame(undefined)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
        >
          <span className="text-lg">←</span>
          Back to games
        </button>
        <div className="sm:mx-0 -mx-6 px-4 sm:px-0">
          <FlashcardGame
            words={words}
            storageKey={storageKey}
            className="mx-auto w-full max-w-xl sm:max-w-2xl"
          />
        </div>
      </div>
    );
  }

  if (activeGame === 'multiple-choice') {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setActiveGame(undefined)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
        >
          <span className="text-lg">←</span>
          Back to games
        </button>
        <div className="sm:mx-0 -mx-6 px-4 sm:px-0">
          <MultipleChoiceGame
            words={words}
            className="mx-auto w-full max-w-xl sm:max-w-2xl"
            questionCount={20}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Games
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Choose a game to practice this lesson.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setActiveGame('flashcard')}
          className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Flashcard
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Flip cards, reveal details, and rate your recall.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 transition group-hover:text-zinc-600 dark:group-hover:text-zinc-200">
            Play now
            <span aria-hidden="true">→</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveGame('multiple-choice')}
          className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Multiple choice
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Pick the correct word from four options.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 transition group-hover:text-zinc-600 dark:group-hover:text-zinc-200">
            Play now
            <span aria-hidden="true">→</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default GamesTab;
