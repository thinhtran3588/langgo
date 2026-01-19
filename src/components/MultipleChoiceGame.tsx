'use client';

import { useI18n } from '@/components/I18nProvider';
import {
  resolveTranslation,
  type Locale,
  type TranslationsMap,
} from '@/lib/i18n';
import { useCallback, useMemo, useState } from 'react';

type WordEntry = {
  word: string;
  type?: string;
  pronunciation?: string;
  translations?: TranslationsMap;
};

type Question = {
  prompt: string;
  options: Array<{
    id: string;
    label: string;
  }>;
  correctId: string;
  promptIsWord: boolean;
  optionsAreWord: boolean;
};

type MultipleChoiceGameProps = {
  words: WordEntry[];
  className?: string;
  questionCount?: number;
};

const DEFAULT_QUESTION_COUNT = 20;

const shuffle = <T,>(items: T[]) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

type QuestionSource = {
  prompt: string;
  answer: string;
  answerKey: string;
  kind: 'word-to-translation' | 'translation-to-word';
};

const buildQuestionSources = (
  words: WordEntry[],
  locale: Locale
): QuestionSource[] => {
  const sources: QuestionSource[] = [];

  words.forEach((entry, index) => {
    const { word, translations } = entry;
    const trimmedTranslation = resolveTranslation(translations, locale)?.trim();
    if (!word?.trim()) {
      return;
    }

    if (!trimmedTranslation) {
      return;
    }

    sources.push({
      prompt: trimmedTranslation,
      answer: word,
      answerKey: `${word}-${index}-word`,
      kind: 'translation-to-word',
    });
    sources.push({
      prompt: word,
      answer: trimmedTranslation,
      answerKey: `${word}-${index}-translation`,
      kind: 'word-to-translation',
    });
  });

  return sources;
};

const buildQuestions = (
  words: WordEntry[],
  questionCount: number,
  locale: Locale
): Question[] => {
  if (words.length < 4) {
    return [];
  }

  const sources = buildQuestionSources(words, locale);
  if (sources.length < 4) {
    return [];
  }

  const wordToTranslation = sources.filter(
    (source) => source.kind === 'word-to-translation'
  );
  const translationToWord = sources.filter(
    (source) => source.kind === 'translation-to-word'
  );
  if (wordToTranslation.length < 4 || translationToWord.length < 4) {
    return [];
  }

  const questions: Question[] = [];
  const total = Math.max(1, questionCount);

  for (let index = 0; index < total; index += 1) {
    const pool = Math.random() < 0.5 ? wordToTranslation : translationToWord;
    const correctIndex = Math.floor(Math.random() * pool.length);
    const correctSource = pool[correctIndex];
    const correctId = `${correctSource.answerKey}-${index}`;
    const optionsAreWord = correctSource.kind === 'translation-to-word';
    const promptIsWord = !optionsAreWord;
    const optionIndices = new Set<number>([correctIndex]);

    while (optionIndices.size < 4) {
      optionIndices.add(Math.floor(Math.random() * pool.length));
    }

    const options = shuffle(
      Array.from(optionIndices).map((sourceIndex) => {
        const entry = pool[sourceIndex];
        return {
          id:
            sourceIndex === correctIndex
              ? correctId
              : `${entry.answerKey}-${index}`,
          label: entry.answer,
        };
      })
    );

    questions.push({
      prompt: correctSource.prompt,
      options,
      correctId,
      promptIsWord,
      optionsAreWord,
    });
  }

  return questions;
};

const MultipleChoiceGame = ({
  words,
  className,
  questionCount = DEFAULT_QUESTION_COUNT,
}: MultipleChoiceGameProps) => {
  const { locale, t } = useI18n();
  const usableWords = useMemo(
    () => words.filter((entry) => entry.word?.trim()),
    [words]
  );
  const [questions, setQuestions] = useState<Question[]>(() =>
    buildQuestions(usableWords, questionCount, locale)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const resetGame = useCallback(() => {
    setQuestions(buildQuestions(usableWords, questionCount, locale));
    setCurrentIndex(0);
    setSelectedId(undefined);
    setCorrectCount(0);
    setIsComplete(false);
  }, [locale, questionCount, usableWords]);

  const handleAnswer = (optionId: string) => {
    if (selectedId || isComplete || !questions.length) {
      return;
    }

    setSelectedId(optionId);
    if (optionId === questions[currentIndex]?.correctId) {
      setCorrectCount((count) => count + 1);
    }
  };

  const handleNext = () => {
    if (!selectedId) {
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setIsComplete(true);
      return;
    }

    setCurrentIndex(nextIndex);
    setSelectedId(undefined);
  };

  if (usableWords.length < 4) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        {t('mc.addWords')}
      </p>
    );
  }

  if (!questions.length) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        {t('mc.unable')}
      </p>
    );
  }

  if (isComplete) {
    return (
      <div className="space-y-4 rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {t('mc.completeTitle')}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {t('mc.completeBody', {
              correct: correctCount,
              total: questions.length,
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={resetGame}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {t('mc.playAgain')}
        </button>
      </div>
    );
  }

  const activeQuestion = questions[currentIndex];
  const isCorrect = selectedId === activeQuestion.correctId;
  const promptTextClass = activeQuestion.promptIsWord
    ? 'text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-zinc-100'
    : 'text-2xl font-semibold text-zinc-900 sm:text-3xl dark:text-zinc-100';
  const optionTextClass = activeQuestion.optionsAreWord
    ? 'text-lg sm:text-xl'
    : 'text-sm sm:text-base';

  return (
    <div
      className={['space-y-5 sm:space-y-6', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          {t('mc.title')}
        </p>
        <p className={`mt-4 ${promptTextClass}`}>{activeQuestion.prompt}</p>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
          {t('mc.choose')}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {activeQuestion.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrectOption = option.id === activeQuestion.correctId;
          const statusStyles =
            selectedId && isCorrectOption
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500/80 dark:bg-emerald-500/10 dark:text-emerald-200'
              : selectedId && isSelected && !isCorrectOption
                ? 'border-rose-500 bg-rose-50 text-rose-600 dark:border-rose-500/70 dark:bg-rose-500/10 dark:text-rose-200'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:text-zinc-100';

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleAnswer(option.id)}
              disabled={selectedId !== undefined}
              className={[
                'rounded-2xl border px-4 py-3 text-left font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-600 dark:focus-visible:ring-offset-zinc-900',
                optionTextClass,
                statusStyles,
                selectedId ? 'cursor-default' : 'cursor-pointer',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wide text-zinc-400">
        <span>
          {t('mc.questionCount', {
            current: currentIndex + 1,
            total: questions.length,
          })}
        </span>
        <span>{t('mc.correctCount', { count: correctCount })}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          {selectedId ? (isCorrect ? t('mc.correct') : t('mc.incorrect')) : ' '}
        </div>
        <button
          type="button"
          onClick={handleNext}
          disabled={selectedId === undefined}
          className={[
            'rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition',
            selectedId === undefined
              ? 'cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
              : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white',
          ].join(' ')}
        >
          {currentIndex + 1 === questions.length
            ? t('mc.finish')
            : t('mc.next')}
        </button>
      </div>
    </div>
  );
};

export default MultipleChoiceGame;
