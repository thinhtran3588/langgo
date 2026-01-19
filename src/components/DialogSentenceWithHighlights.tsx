'use client';

import { useI18n } from '@/components/I18nProvider';
import LanguageText from '@/components/LanguageText';
import { useMemo } from 'react';

type LessonTranslations = {
  en?: string;
  vi?: string;
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

type DialogSentenceWithHighlightsProps = {
  text: string;
  pronunciation?: string;
  translations?: LessonTranslations;
  newWords: NewWordEntry[];
  textClassName?: string;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

const resolveTranslation = (
  locale: 'en' | 'vi',
  translations?: LessonTranslations
) => translations?.[locale] ?? translations?.en ?? translations?.vi ?? '—';

const WordPopover = ({ entry }: { entry: NewWordEntry }) => {
  const { locale } = useI18n();
  const translation = resolveTranslation(locale, entry.translations);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="rounded-sm bg-amber-100 px-1 text-zinc-900 transition hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-100 dark:hover:bg-amber-500/30"
      >
        {entry.word}
      </button>
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-xl border border-zinc-200 bg-white p-3 text-left text-xs text-zinc-600 opacity-0 shadow-lg transition group-hover/word:opacity-100 group-focus-within/word:opacity-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {entry.word}
        </span>
        <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
          {entry.pronunciation ? `[${entry.pronunciation}]` : '—'}
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {entry.type ? (
            <span className="inline-flex rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              {entry.type}
            </span>
          ) : null}
          <span className="text-xs text-zinc-600 dark:text-zinc-300">
            {translation}
          </span>
        </div>
      </span>
    </span>
  );
};

const DialogSentenceWithHighlights = ({
  text,
  pronunciation,
  translations,
  newWords,
  textClassName,
}: DialogSentenceWithHighlightsProps) => {
  const wordMap = useMemo(() => {
    const map = new Map<string, NewWordEntry>();
    newWords.forEach((entry) => {
      if (entry.word) {
        buildWordVariants(entry.word).forEach((variant) => {
          if (!map.has(variant)) {
            map.set(variant, entry);
          }
        });
      }
    });
    return map;
  }, [newWords]);

  const highlightedText = useMemo(() => {
    if (!text || wordMap.size === 0) {
      return text;
    }
    const words = Array.from(wordMap.keys()).sort(
      (a, b) => b.length - a.length
    );
    const regex = new RegExp(
      `(${words.map((word) => escapeRegExp(word)).join('|')})`,
      'g'
    );
    return text.split(regex).map((part, index) => {
      const entry = wordMap.get(part);
      if (!entry) {
        return part;
      }
      return (
        <span
          key={`${part}-${index}`}
          className="group/word relative inline-flex"
        >
          <WordPopover entry={entry} />
        </span>
      );
    });
  }, [text, wordMap]);

  return (
    <LanguageText
      text={text}
      textContent={highlightedText}
      pronunciation={pronunciation}
      translations={translations}
      textClassName={textClassName}
    />
  );
};

export default DialogSentenceWithHighlights;
