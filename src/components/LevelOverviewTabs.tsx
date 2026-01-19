'use client';

import ContentTabs from '@/components/ContentTabs';
import GrammarDescription from '@/components/GrammarDescription';
import GamesTab from '@/components/GamesTab';
import LanguageText from '@/components/LanguageText';
import LocalizedText from '@/components/LocalizedText';
import TranslatedText from '@/components/TranslatedText';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type LessonLabel = {
  text: string;
  translations?: {
    en?: string;
    vi?: string;
  };
};

type LessonSummary = {
  id: string;
  label: LessonLabel;
};

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

type LessonData = {
  title?: {
    text: string;
    pronunciation?: string;
    translations?: LessonTranslations;
  };
  newWords?: Array<{
    word: string;
    type?: string;
    pronunciation?: string;
    translations?: LessonTranslations;
    example?: {
      text: string;
      pronunciation?: string;
      translations?: LessonTranslations;
    };
  }>;
  grammars?: Array<{
    grammar: string;
    descriptions?: LessonTranslations;
    examples?: Array<{
      text: string;
      pronunciation?: string;
      translations?: LessonTranslations;
    }>;
  }>;
  dialogs?: DialogEntry[];
};

type LessonEntry = {
  lesson: LessonSummary;
  data: LessonData;
};

type LevelOverviewTabsProps = {
  languageId: string;
  courseId: string;
  levelId: string;
  lessons: LessonSummary[];
};

const storageKeyForLevel = (
  languageId: string,
  courseId: string,
  levelId: string
) => `langgo.level.lessonSelection.${languageId}.${courseId}.${levelId}`;

const LevelOverviewTabs = ({
  languageId,
  courseId,
  levelId,
  lessons,
}: LevelOverviewTabsProps) => {
  const [lessonEntries, setLessonEntries] = useState<LessonEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | undefined>(undefined);
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const loadLessons = async () => {
      setIsLoading(true);
      setLoadError(undefined);
      try {
        const results = await Promise.all(
          lessons.map(async (lesson) => {
            const response = await fetch(
              `/data/${languageId}/${courseId}/${levelId}/${lesson.id}.json`
            );
            if (!response.ok) {
              throw new Error(`Failed to load ${lesson.id}`);
            }
            const data = (await response.json()) as LessonData;
            return { lesson, data };
          })
        );
        if (!cancelled) {
          setLessonEntries(results);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : 'Unable to load lessons.'
          );
          setLessonEntries([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadLessons();
    return () => {
      cancelled = true;
    };
  }, [courseId, languageId, levelId, lessons]);

  useEffect(() => {
    const key = storageKeyForLevel(languageId, courseId, levelId);
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed) && parsed.length) {
          setSelectedLessonIds(parsed);
          return;
        }
      }
    } catch {
      // Ignore storage failures.
    }
    setSelectedLessonIds(lessons.map((lesson) => lesson.id));
  }, [courseId, languageId, levelId, lessons]);

  const selectedLessonSet = useMemo(
    () => new Set(selectedLessonIds),
    [selectedLessonIds]
  );

  const persistSelection = (nextSelection: string[]) => {
    setSelectedLessonIds(nextSelection);
    try {
      localStorage.setItem(
        storageKeyForLevel(languageId, courseId, levelId),
        JSON.stringify(nextSelection)
      );
    } catch {
      // Ignore storage failures.
    }
  };

  const toggleLessonSelection = (lessonId: string) => {
    const nextSelection = selectedLessonSet.has(lessonId)
      ? selectedLessonIds.filter((id) => id !== lessonId)
      : [...selectedLessonIds, lessonId];
    persistSelection(nextSelection);
  };

  const allNewWords = useMemo(
    () =>
      lessonEntries.flatMap((entry) =>
        (entry.data.newWords ?? []).map((word, index) => ({
          ...word,
          key: `${entry.lesson.id}-${index}-${word.word}`,
        }))
      ),
    [lessonEntries]
  );

  const allGrammars = useMemo(
    () =>
      lessonEntries.flatMap((entry) =>
        (entry.data.grammars ?? []).map((grammarItem, index) => ({
          ...grammarItem,
          key: `${entry.lesson.id}-${index}-${grammarItem.grammar}`,
        }))
      ),
    [lessonEntries]
  );

  const selectedWords = useMemo(
    () =>
      lessonEntries.flatMap((entry) =>
        selectedLessonSet.has(entry.lesson.id)
          ? (entry.data.newWords ?? [])
          : []
      ),
    [lessonEntries, selectedLessonSet]
  );

  const dialogsByLessonId = useMemo(
    () => new Map(lessonEntries.map((entry) => [entry.lesson.id, entry])),
    [lessonEntries]
  );

  const allDialogs = useMemo(
    () =>
      selectedLessonIds.flatMap((lessonId) => {
        const entry = dialogsByLessonId.get(lessonId);
        if (!entry) {
          return [];
        }
        return (entry.data.dialogs ?? [])
          .filter((dialog) => dialog.sentences?.length)
          .map((dialog, dialogIndex) => ({
            lesson: {
              id: entry.lesson.id,
              text: entry.lesson.label.text,
              translations: entry.lesson.label.translations,
            },
            dialogNumber: dialog.id ?? dialogIndex + 1,
            dialog,
          }));
      }),
    [dialogsByLessonId, selectedLessonIds]
  );

  const lessonsContent = (
    <div className="space-y-4">
      {lessonEntries.length ? (
        <div className="space-y-3">
          {lessonEntries.map((entry) => (
            <div
              key={entry.lesson.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div className="space-y-3">
                <Link
                  href={`/languages/${languageId}/${courseId}/${levelId}/${entry.lesson.id}`}
                  className="block w-fit text-xs font-semibold uppercase tracking-wide text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  <LocalizedText
                    translations={entry.lesson.label.translations}
                    fallback={entry.lesson.label.text}
                  />
                </Link>
                {entry.data.title ? (
                  <LanguageText
                    text={entry.data.title.text}
                    textContent={
                      <Link
                        href={`/languages/${languageId}/${courseId}/${levelId}/${entry.lesson.id}`}
                        className="transition hover:text-zinc-700 dark:hover:text-zinc-200"
                      >
                        {entry.data.title.text}
                      </Link>
                    }
                    pronunciation={entry.data.title.pronunciation}
                    translations={entry.data.title.translations}
                    textClassName="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                  />
                ) : (
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    <TranslatedText
                      id="lesson.noDialogs"
                      fallback="No dialogs available for this lesson yet."
                    />
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          <TranslatedText
            id="lesson.noNewWords"
            fallback="No new words available for this lesson yet."
          />
        </p>
      )}
    </div>
  );

  const newWordsContent = (
    <div className="space-y-6">
      {lessonEntries.length ? (
        lessonEntries.map((entry) => (
          <section key={entry.lesson.id} className="space-y-3">
            <header className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <LocalizedText
                  translations={entry.lesson.label.translations}
                  fallback={entry.lesson.label.text}
                />
              </p>
              {entry.data.title ? (
                <LanguageText
                  text={entry.data.title.text}
                  pronunciation={entry.data.title.pronunciation}
                  translations={entry.data.title.translations}
                  textClassName="text-base font-semibold text-zinc-900 dark:text-zinc-100"
                />
              ) : undefined}
            </header>
            {entry.data.newWords?.length ? (
              <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="hidden grid-cols-4 gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 md:grid">
                  <span>
                    <TranslatedText id="lesson.word" fallback="Word" />
                  </span>
                  <span>
                    <TranslatedText
                      id="lesson.pronunciation"
                      fallback="Pronunciation"
                    />
                  </span>
                  <span>
                    <TranslatedText id="lesson.type" fallback="Type" />
                  </span>
                  <span>
                    <TranslatedText
                      id="lesson.translation"
                      fallback="Translation"
                    />
                  </span>
                </div>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {entry.data.newWords.map((word, index) => (
                    <div
                      key={`${entry.lesson.id}-word-${index}-${word.word}`}
                      className="flex flex-col gap-2 px-4 py-4 text-sm text-zinc-700 dark:text-zinc-200 md:grid md:grid-cols-4 md:items-center md:gap-2"
                    >
                      <div className="flex flex-wrap items-center gap-3 md:contents">
                        <a
                          href={`https://hanzii.net/search/word/${encodeURIComponent(
                            word.word
                          )}?hl=${languageId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xl font-semibold text-zinc-900 transition hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-200 sm:text-2xl"
                        >
                          {word.word}
                        </a>
                        <span className="text-zinc-600 dark:text-zinc-300">
                          {word.pronunciation ? `[${word.pronunciation}]` : '—'}
                        </span>
                        <span>
                          {word.type ? (
                            <span className="inline-flex rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                              {word.type}
                            </span>
                          ) : (
                            '—'
                          )}
                        </span>
                      </div>
                      <div className="text-zinc-700 dark:text-zinc-200 md:contents">
                        <LocalizedText translations={word.translations} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                <TranslatedText
                  id="lesson.noNewWords"
                  fallback="No new words available for this lesson yet."
                />
              </p>
            )}
          </section>
        ))
      ) : (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          <TranslatedText
            id="lesson.noNewWords"
            fallback="No new words available for this lesson yet."
          />
        </p>
      )}
    </div>
  );

  const grammarContent = (
    <div className="space-y-6">
      {lessonEntries.length ? (
        lessonEntries.map((entry) => (
          <section key={entry.lesson.id} className="space-y-3">
            <header className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <LocalizedText
                  translations={entry.lesson.label.translations}
                  fallback={entry.lesson.label.text}
                />
              </p>
              {entry.data.title ? (
                <LanguageText
                  text={entry.data.title.text}
                  pronunciation={entry.data.title.pronunciation}
                  translations={entry.data.title.translations}
                  textClassName="text-base font-semibold text-zinc-900 dark:text-zinc-100"
                />
              ) : undefined}
            </header>
            {entry.data.grammars?.length ? (
              <div className="space-y-4">
                {entry.data.grammars.map((grammarItem, index) => (
                  <article
                    key={`${entry.lesson.id}-grammar-${index}-${grammarItem.grammar}`}
                    className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {grammarItem.grammar}
                      </h3>
                      {grammarItem.descriptions ? (
                        <GrammarDescription
                          descriptions={grammarItem.descriptions}
                          className="mt-2 whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-300"
                        />
                      ) : undefined}
                    </div>
                    {grammarItem.examples?.length ? (
                      <div className="space-y-2">
                        {grammarItem.examples.map((example, exampleIndex) => (
                          <div
                            key={`${entry.lesson.id}-grammar-${index}-example-${exampleIndex}`}
                            className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950"
                          >
                            <LanguageText
                              text={example.text}
                              pronunciation={example.pronunciation}
                              translations={example.translations}
                              textClassName="text-lg font-medium text-zinc-900 dark:text-zinc-100"
                            />
                          </div>
                        ))}
                      </div>
                    ) : undefined}
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                <TranslatedText
                  id="lesson.noGrammar"
                  fallback="No grammar notes available for this lesson yet."
                />
              </p>
            )}
          </section>
        ))
      ) : (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          <TranslatedText
            id="lesson.noGrammar"
            fallback="No grammar notes available for this lesson yet."
          />
        </p>
      )}
    </div>
  );

  const gamesContent = (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <TranslatedText
            id="level.selectLessons"
            fallback="Select lessons for games"
          />
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {lessons.map((lesson) => {
            const isChecked = selectedLessonSet.has(lesson.id);
            return (
              <label
                key={lesson.id}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleLessonSelection(lesson.id)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900"
                />
                <LocalizedText
                  translations={lesson.label.translations}
                  fallback={lesson.label.text}
                />
              </label>
            );
          })}
        </div>
      </div>
      <GamesTab
        words={selectedWords}
        dialogs={allDialogs}
        languageId={languageId}
        courseId={courseId}
        levelId={levelId}
        storageKey={`langgo.flashcard.${languageId}.${courseId}.${levelId}`}
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent dark:border-zinc-700 dark:border-t-transparent" />
          <TranslatedText id="level.loading" fallback="Loading lessons..." />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-300">{loadError}</p>
    );
  }

  const tabs = [
    {
      id: 'lessons',
      label: <TranslatedText id="level.lessonsLabel" fallback="Lessons" />,
      content: lessonsContent,
    },
    {
      id: 'new-words',
      label: <TranslatedText id="lesson.tab.newWords" fallback="New Words" />,
      content: newWordsContent,
    },
    {
      id: 'grammar',
      label: <TranslatedText id="lesson.tab.grammar" fallback="Grammar" />,
      content: grammarContent,
    },
    {
      id: 'games',
      label: <TranslatedText id="lesson.tab.games" fallback="Games" />,
      content: gamesContent,
    },
  ];

  return <ContentTabs tabs={tabs} />;
};

export default LevelOverviewTabs;
