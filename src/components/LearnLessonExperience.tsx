'use client';

import Link from 'next/link';
import { useState } from 'react';
import DialogAudioPlayer from '@/components/DialogAudioPlayer';
import DialogSentenceWithHighlights from '@/components/DialogSentenceWithHighlights';
import GamesTab from '@/components/GamesTab';
import { useI18n } from '@/components/I18nProvider';
import LanguageText from '@/components/LanguageText';
import LocalizedText from '@/components/LocalizedText';
import TranslatedText from '@/components/TranslatedText';

type LessonTranslations = {
  en?: string;
  vi?: string;
};

type DialogSentence = {
  text: string;
  pronunciation?: string;
  translations?: LessonTranslations;
};

type DialogEntry = {
  id?: number;
  name?: {
    text: string;
    pronunciation?: string;
    translations?: LessonTranslations;
  };
  sentences?: DialogSentence[];
};

type NewWordEntry = {
  word: string;
  type?: string;
  pronunciation?: string;
  translations?: LessonTranslations;
  example?: {
    text: string;
    pronunciation?: string;
    translations?: LessonTranslations;
  };
};

type LessonData = {
  title?: {
    text: string;
    pronunciation?: string;
    translations?: LessonTranslations;
  };
  newWords?: NewWordEntry[];
  dialogs?: DialogEntry[];
};

type LessonLabel = {
  text: string;
  translations?: LessonTranslations;
};

type LearnLessonExperienceProps = {
  languageId: string;
  courseId: string;
  levelId: string;
  lessonId: string;
  lessonLabel: LessonLabel;
  lessonData: LessonData;
};

type DialogGroup = {
  dialog?: DialogEntry;
  words: NewWordEntry[];
};

const resolveTranslation = (
  locale: 'en' | 'vi',
  translations?: LessonTranslations
) => translations?.[locale] ?? translations?.en ?? translations?.vi ?? '—';

const buildWordVariants = (word: string) => {
  const variants = new Set<string>();
  const trimmed = word.trim();

  if (!trimmed) {
    return [];
  }

  variants.add(trimmed);

  const withoutParens = trimmed.replace(/[()（）]/g, '');
  if (withoutParens) {
    variants.add(withoutParens);
  }

  const removedOptional = trimmed
    .replace(/\([^)]*\)/g, '')
    .replace(/（[^）]*）/g, '');
  if (removedOptional) {
    variants.add(removedOptional);
  }

  return Array.from(variants);
};

const getDialogWords = (
  dialog: DialogEntry | undefined,
  words: NewWordEntry[] = []
) => {
  const dialogText =
    dialog?.sentences?.map((sentence) => sentence.text).join(' ') ?? '';
  if (!dialogText) {
    return [];
  }

  return words.filter((entry) =>
    buildWordVariants(entry.word).some((variant) =>
      dialogText.includes(variant)
    )
  );
};

const LearnLessonExperience = ({
  languageId,
  courseId,
  levelId,
  lessonId,
  lessonLabel,
  lessonData,
}: LearnLessonExperienceProps) => {
  const { locale } = useI18n();
  const dialogs = lessonData.dialogs ?? [];
  const dialogGroups: DialogGroup[] = dialogs.length
    ? (() => {
        const seenWords = new Set<string>();

        return dialogs.map((dialog) => {
          const dialogWords = getDialogWords(dialog, lessonData.newWords ?? []);
          const filteredWords = dialogWords.filter((entry) => {
            if (seenWords.has(entry.word)) {
              return false;
            }
            seenWords.add(entry.word);
            return true;
          });

          return {
            dialog,
            words: filteredWords,
          };
        });
      })()
    : [
        {
          dialog: undefined,
          words: lessonData.newWords ?? [],
        },
      ];

  const [dialogIndex, setDialogIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<'words' | 'dialog' | 'games'>(
    dialogGroups[0]?.words?.length
      ? 'words'
      : dialogs.length
        ? 'dialog'
        : 'games'
  );

  const currentGroup = dialogGroups[dialogIndex];
  const currentWord = currentGroup?.words?.[wordIndex];

  const handleNextWord = () => {
    if (!currentGroup?.words?.length) {
      setPhase('dialog');
      return;
    }
    const nextIndex = wordIndex + 1;
    if (nextIndex >= currentGroup.words.length) {
      setPhase('dialog');
      setWordIndex(0);
      return;
    }
    setWordIndex(nextIndex);
  };

  const handleNextDialog = () => {
    const nextIndex = dialogIndex + 1;
    if (nextIndex >= dialogGroups.length) {
      setPhase('games');
      return;
    }
    setDialogIndex(nextIndex);
    setWordIndex(0);
    setPhase(dialogGroups[nextIndex]?.words?.length ? 'words' : 'dialog');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="space-y-3">
        <Link
          href={`/languages/${languageId}/${courseId}/${levelId}/${lessonId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
        >
          <span className="text-lg">←</span>
          <TranslatedText id="learn.backToLesson" fallback="Back to lesson" />
        </Link>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <LocalizedText
              translations={lessonLabel.translations}
              fallback={lessonLabel.text}
            />
          </p>
          {lessonData.title ? (
            <LanguageText
              text={lessonData.title.text}
              pronunciation={lessonData.title.pronunciation}
              translations={lessonData.title.translations}
              textClassName="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-4xl"
            />
          ) : undefined}
        </div>
      </header>

      {phase === 'words' && currentWord ? (
        <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            <TranslatedText id="learn.newWord" fallback="New word" />
          </p>
          <p className="mt-4 text-3xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {currentWord.word}
          </p>
          <div className="mt-6 space-y-3 text-left text-sm text-zinc-600 dark:text-zinc-300">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <TranslatedText
                  id="flashcard.pronunciation"
                  fallback="Pronunciation"
                />
              </span>
              <span>{currentWord.pronunciation ?? '—'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <TranslatedText id="flashcard.type" fallback="Type" />
              </span>
              <span>{currentWord.type ?? '—'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <TranslatedText
                  id="flashcard.translation"
                  fallback="Translation"
                />
              </span>
              <span>
                {resolveTranslation(locale, currentWord.translations)}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={handleNextWord}
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <TranslatedText id="learn.next" fallback="Next" />
            </button>
          </div>
        </div>
      ) : undefined}

      {phase === 'dialog' && currentGroup?.dialog ? (
        <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="space-y-1 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              <TranslatedText id="learn.dialog" fallback="Dialog" />
            </p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {currentGroup.dialog.name?.text ?? `Dialog ${dialogIndex + 1}`}
            </p>
            {currentGroup.dialog.name?.translations ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {resolveTranslation(
                  locale,
                  currentGroup.dialog.name.translations
                )}
              </p>
            ) : undefined}
          </div>
          <ol className="space-y-3">
            {currentGroup.dialog.sentences?.map((sentence, sentenceIndex) => (
              <li
                key={`${sentence.text}-${sentenceIndex}`}
                className="rounded-lg border border-zinc-100 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <DialogSentenceWithHighlights
                  text={sentence.text}
                  pronunciation={sentence.pronunciation}
                  translations={sentence.translations}
                  newWords={currentGroup.words ?? []}
                  textClassName="text-lg font-medium text-zinc-900 dark:text-zinc-100"
                />
              </li>
            ))}
          </ol>
          <div className="rounded-lg border border-zinc-100 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950">
            <DialogAudioPlayer
              className="w-full"
              groupId={`${languageId}-${courseId}-${levelId}-${lessonId}-learn-${dialogIndex}`}
              src={`/data/${languageId}/${courseId}/${levelId}/${lessonId}-dialog${
                currentGroup.dialog.id ?? dialogIndex + 1
              }.mp3`}
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleNextDialog}
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <TranslatedText id="learn.next" fallback="Next" />
            </button>
          </div>
        </div>
      ) : undefined}

      {phase === 'games' ? (
        <div className="space-y-4">
          <GamesTab
            words={lessonData.newWords ?? []}
            storageKey={`langgo.flashcard.${languageId}.${courseId}.${levelId}.${lessonId}.learn`}
          />
        </div>
      ) : undefined}

    </div>
  );
};

export default LearnLessonExperience;
