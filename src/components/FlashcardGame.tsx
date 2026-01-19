'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type FlashcardWord = {
  word: string;
  type?: string;
  pronunciation?: string;
  translation?: string;
  example?: {
    text: string;
    pronunciation?: string;
    translation?: string;
  };
};

type FlashcardGameProps = {
  words: FlashcardWord[];
  className?: string;
  storageKey?: string;
};

type ScoreMap = Record<string, number>;

const STORAGE_KEY = 'langgo.flashcard.scores';

const ratingStyles: Record<
  number,
  {
    bg: string;
    border: string;
    text: string;
    darkText: string;
    hover: string;
  }
> = {
  1: {
    bg: 'bg-rose-500',
    border: 'border-rose-500',
    text: 'text-rose-600',
    darkText: 'dark:text-rose-200',
    hover: 'hover:bg-rose-50 dark:hover:bg-rose-500/10',
  },
  2: {
    bg: 'bg-orange-500',
    border: 'border-orange-500',
    text: 'text-orange-600',
    darkText: 'dark:text-orange-200',
    hover: 'hover:bg-orange-50 dark:hover:bg-orange-500/10',
  },
  3: {
    bg: 'bg-amber-500',
    border: 'border-amber-500',
    text: 'text-amber-600',
    darkText: 'dark:text-amber-200',
    hover: 'hover:bg-amber-50 dark:hover:bg-amber-500/10',
  },
  4: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    text: 'text-emerald-600',
    darkText: 'dark:text-emerald-200',
    hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-500/10',
  },
  5: {
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-600',
    darkText: 'dark:text-blue-200',
    hover: 'hover:bg-blue-50 dark:hover:bg-blue-500/10',
  },
};

const buildWordKey = (entry: FlashcardWord) =>
  [entry.word, entry.pronunciation, entry.translation, entry.type]
    .filter(Boolean)
    .join('|');

const getWeight = (score: number | undefined) => {
  const safeScore = score && score >= 1 && score <= 5 ? score : 3;
  return 6 - safeScore;
};

const pickWeightedIndex = (
  indices: number[],
  scores: ScoreMap,
  keys: string[]
) => {
  const weights = indices.map((index) => getWeight(scores[keys[index]]));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const roll = Math.random() * total;
  let cursor = 0;

  for (let i = 0; i < indices.length; i += 1) {
    cursor += weights[i];
    if (roll <= cursor) {
      return indices[i];
    }
  }

  return indices[indices.length - 1];
};

const FlashcardGame = ({
  words,
  className,
  storageKey = STORAGE_KEY,
}: FlashcardGameProps) => {
  const wordKeys = useMemo(() => words.map(buildWordKey), [words]);
  const [scores, setScores] = useState<ScoreMap>({});
  const [scoresLoaded, setScoresLoaded] = useState(false);
  const [remaining, setRemaining] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(
    undefined
  );
  const [isRevealed, setIsRevealed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const hasInitialized = useRef(false);

  const persistScores = useCallback(
    (nextScores: ScoreMap) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(nextScores));
      } catch {
        // Ignore storage failures (private mode or quota).
      }
    },
    [storageKey]
  );

  const resetGame = useCallback(
    (nextScores: ScoreMap) => {
      if (!words.length) {
        setRemaining([]);
        setCurrentIndex(undefined);
        setIsComplete(true);
        setIsRevealed(false);
        return;
      }

      const indices = words.map((_, index) => index);
      const firstPick = pickWeightedIndex(indices, nextScores, wordKeys);
      setRemaining(indices.filter((index) => index !== firstPick));
      setCurrentIndex(firstPick);
      setIsComplete(false);
      setIsRevealed(false);
    },
    [wordKeys, words]
  );

  useEffect(() => {
    hasInitialized.current = false;
    setScoresLoaded(false);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as ScoreMap;
        setScores(parsed);
      } else {
        setScores({});
      }
    } catch {
      // Ignore malformed storage.
      setScores({});
    } finally {
      setScoresLoaded(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (scoresLoaded && !hasInitialized.current) {
      resetGame(scores);
      hasInitialized.current = true;
    }
  }, [resetGame, scores, scoresLoaded]);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleRating = (rating: number) => {
    if (currentIndex === undefined) {
      return;
    }

    const key = wordKeys[currentIndex];
    const nextScores = { ...scores, [key]: rating };
    setScores(nextScores);
    persistScores(nextScores);

    if (!remaining.length) {
      setIsComplete(true);
      setCurrentIndex(undefined);
      setIsRevealed(false);
      return;
    }

    const nextIndex = pickWeightedIndex(remaining, nextScores, wordKeys);
    setRemaining(remaining.filter((index) => index !== nextIndex));
    setCurrentIndex(nextIndex);
    setIsRevealed(false);
  };

  const handleRetry = () => {
    resetGame(scores);
  };

  const handleClearProgress = () => {
    setScores({});
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage failures (private mode or quota).
    }
    resetGame({});
  };

  if (!words.length) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Add new words to play flashcards.
      </p>
    );
  }

  if (isComplete) {
    return (
      <div className="space-y-4 rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Nice work!
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            You reviewed every flashcard.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={handleClearProgress}
            className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-white"
          >
            Clear saved data
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-white"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const activeWord =
    currentIndex !== undefined ? words[currentIndex] : undefined;
  const activeScore =
    currentIndex !== undefined ? scores[wordKeys[currentIndex]] : undefined;
  const activeScoreStyles =
    activeScore && ratingStyles[activeScore]
      ? ratingStyles[activeScore]
      : undefined;

  const reviewedCount =
    words.length - remaining.length - (currentIndex !== undefined ? 1 : 0);

  return (
    <div
      className={['space-y-5 sm:space-y-6', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'rounded-3xl bg-linear-to-br p-0.5 shadow-lg',
          activeScoreStyles
            ? `${activeScoreStyles.bg} ${activeScoreStyles.border}`
            : 'from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-100 dark:via-white dark:to-zinc-100',
        ].join(' ')}
      >
        <div className="rounded-[calc(1.5rem-2px)] bg-white px-4 py-8 text-center shadow-sm sm:px-6 sm:py-10 dark:bg-zinc-950">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Flashcard
          </p>
          <p className="mt-4 text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-zinc-100">
            {activeWord?.word}
          </p>
          {isRevealed ? (
            <div className="mt-6 space-y-3 text-left text-sm text-zinc-600 dark:text-zinc-300">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  Pronunciation
                </span>
                <span>{activeWord?.pronunciation ?? '—'}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  Type
                </span>
                <span>{activeWord?.type ?? '—'}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  Translation
                </span>
                <span>{activeWord?.translation ?? '—'}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="w-fit rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  Example
                </span>
                <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-200">
                  <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                    {activeWord?.example?.text ?? '—'}
                  </p>
                  {activeWord?.example?.pronunciation ? (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      [{activeWord.example.pronunciation}]
                    </p>
                  ) : undefined}
                  {activeWord?.example?.translation ? (
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      {activeWord.example.translation}
                    </p>
                  ) : undefined}
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleReveal}
              className="mt-6 w-full rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 sm:w-auto dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-white"
            >
              Reveal answer
            </button>
          )}
        </div>
      </div>

      {isRevealed ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            How well did you know this?
          </p>
          <div className="mt-3 grid grid-cols-5 gap-2 text-sm font-semibold sm:gap-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRating(rating)}
                className={[
                  'rounded-xl border py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-600 dark:focus-visible:ring-offset-zinc-900',
                  activeScore === rating
                    ? `${ratingStyles[rating].bg} ${ratingStyles[rating].border} text-white shadow-sm`
                    : `${ratingStyles[rating].border} ${ratingStyles[rating].text} ${ratingStyles[rating].darkText} ${ratingStyles[rating].hover}`,
                ].join(' ')}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      ) : undefined}

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wide text-zinc-400">
        <span>
          {remaining.length + (currentIndex !== undefined ? 1 : 0)} cards
        </span>
        <div className="flex items-center gap-3">
          <span>{reviewedCount} reviewed</span>
          <button
            type="button"
            onClick={handleClearProgress}
            className="rounded-full border border-transparent px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400 transition hover:border-zinc-200 hover:text-zinc-600 dark:hover:border-zinc-800 dark:hover:text-zinc-200"
          >
            Clear saved data
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardGame;
