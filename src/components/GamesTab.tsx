'use client';

import FlashcardGame from '@/components/FlashcardGame';
import { useI18n } from '@/components/I18nProvider';
import MultipleChoiceGame from '@/components/MultipleChoiceGame';
import ReadDialogGame from '@/components/ReadDialogGame';
import { type TranslationsMap } from '@/lib/i18n';
import { useState } from 'react';

type GameOption = 'flashcard' | 'multiple-choice' | 'read-dialog' | undefined;

type GamesTabProps = {
  words: Array<{
    word: string;
    type?: string;
    pronunciation?: string;
    translations?: TranslationsMap;
    example?: {
      text: string;
      pronunciation?: string;
      translations?: TranslationsMap;
    };
  }>;
  dialogs?: Array<{
    lesson: {
      id: string;
      text: string;
      translations?: TranslationsMap;
    };
    dialogNumber: number;
    dialog: {
      id?: number;
      name?: {
        text: string;
        pronunciation?: string;
        translations?: TranslationsMap;
      };
      sentences?: Array<{
        text: string;
        pronunciation?: string;
        translations?: TranslationsMap;
      }>;
    };
  }>;
  languageId?: string;
  courseId?: string;
  levelId?: string;
  storageKey?: string;
};

const GamesTab = ({
  words,
  dialogs = [],
  languageId,
  courseId,
  levelId,
  storageKey,
}: GamesTabProps) => {
  const [activeGame, setActiveGame] = useState<GameOption>(undefined);
  const { locale, t } = useI18n();

  if (activeGame === 'flashcard') {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setActiveGame(undefined)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
        >
          <span className="text-lg">←</span>
          {t('games.backToGames')}
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
          {t('games.backToGames')}
        </button>
        <div className="sm:mx-0 -mx-6 px-4 sm:px-0">
          <MultipleChoiceGame
            words={words}
            className="mx-auto w-full max-w-xl sm:max-w-2xl"
            questionCount={20}
            key={`multiple-choice-${locale}`}
          />
        </div>
      </div>
    );
  }

  if (activeGame === 'read-dialog') {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setActiveGame(undefined)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
        >
          <span className="text-lg">←</span>
          {t('games.backToGames')}
        </button>
        <ReadDialogGame
          dialogs={dialogs}
          languageId={languageId}
          courseId={courseId}
          levelId={levelId}
          key={`read-dialog-${dialogs.length}`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {t('games.title')}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {t('games.subtitle')}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setActiveGame('flashcard')}
          className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {t('games.flashcard')}
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {t('games.flashcardDesc')}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 transition group-hover:text-zinc-600 dark:group-hover:text-zinc-200">
            {t('games.playNow')}
            <span aria-hidden="true">→</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveGame('multiple-choice')}
          className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {t('games.multipleChoice')}
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {t('games.multipleChoiceDesc')}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 transition group-hover:text-zinc-600 dark:group-hover:text-zinc-200">
            {t('games.playNow')}
            <span aria-hidden="true">→</span>
          </span>
        </button>
        {dialogs.length ? (
          <button
            type="button"
            onClick={() => setActiveGame('read-dialog')}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {t('games.readDialog')}
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {t('games.readDialogDesc')}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 transition group-hover:text-zinc-600 dark:group-hover:text-zinc-200">
              {t('games.playNow')}
              <span aria-hidden="true">→</span>
            </span>
          </button>
        ) : undefined}
      </div>
    </div>
  );
};

export default GamesTab;
