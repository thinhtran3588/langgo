import { readFile } from 'fs/promises';
import path from 'path';
import ContentTabs from '@/components/ContentTabs';
import DialogAudioPlayer from '@/components/DialogAudioPlayer';
import DialogSentenceWithHighlights from '@/components/DialogSentenceWithHighlights';
import GrammarDescription from '@/components/GrammarDescription';
import GamesTab from '@/components/GamesTab';
import LanguageText from '@/components/LanguageText';
import LocalizedText from '@/components/LocalizedText';
import TranslatedText from '@/components/TranslatedText';
import { getCourse, getLanguage, getLesson, getLevel } from '@/lib/languages';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type LessonTranslations = {
  en?: string;
  vi?: string;
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
  dialogs?: Array<{
    id?: number;
    name?: {
      text: string;
      pronunciation?: string;
      translations?: LessonTranslations;
    };
    sentences?: Array<{
      text: string;
      pronunciation?: string;
      translations?: LessonTranslations;
    }>;
  }>;
};

type LessonPageProps = {
  params: Promise<{
    language: string;
    course: string;
    level: string;
    lesson: string;
  }>;
};

type LessonNavLink = {
  href: string;
  label: string;
};

const formatLessonAudioId = (lessonKey: string) =>
  lessonKey.replace(/^lesson(\d+)$/, (_match, value: string) => {
    const padded = value.padStart(2, '0');
    return `lesson${padded}`;
  });

const readLessonData = async (
  languageId: string,
  courseId: string,
  levelId: string,
  lessonId: string
): Promise<LessonData | undefined> => {
  const lessonPath = path.join(
    process.cwd(),
    'public',
    'data',
    languageId,
    courseId,
    levelId,
    `${lessonId}.json`
  );

  try {
    const lessonRaw = await readFile(lessonPath, 'utf8');
    return JSON.parse(lessonRaw) as LessonData;
  } catch {
    return undefined;
  }
};

export default async function LessonPage({ params }: LessonPageProps) {
  const {
    language: languageId,
    course: courseId,
    level: levelId,
    lesson: lessonId,
  } = await params;
  const language = getLanguage(languageId);
  const course = getCourse(languageId, courseId);
  const level = getLevel(languageId, courseId, levelId);
  const lesson = getLesson(languageId, courseId, levelId, lessonId);
  const lessonData = await readLessonData(
    languageId,
    courseId,
    levelId,
    lessonId
  );
  const lessonAudioId = formatLessonAudioId(lessonId);

  if (!language || !course || !level || !lesson || !lessonData) {
    notFound();
  }

  const newWordsContent = (
    <div className="space-y-4">
      {lessonData.newWords?.length ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              <TranslatedText
                id="lesson.items"
                fallback={`${lessonData.newWords.length} items`}
                values={{ count: lessonData.newWords.length }}
              />
            </p>
          </div>
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
              {lessonData.newWords.map((entry, index) => (
                <div
                  key={`${entry.word}-${index}`}
                  className="flex flex-col gap-2 px-4 py-4 text-sm text-zinc-700 dark:text-zinc-200 md:grid md:grid-cols-4 md:items-center md:gap-2"
                >
                  <div className="flex flex-wrap items-center gap-3 md:contents">
                    <a
                      href={`https://hanzii.net/search/word/${encodeURIComponent(
                        entry.word
                      )}?hl=${languageId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xl font-semibold text-zinc-900 transition hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-200 sm:text-2xl"
                    >
                      {entry.word}
                    </a>
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {entry.pronunciation ? `[${entry.pronunciation}]` : '—'}
                    </span>
                    <span>
                      {entry.type ? (
                        <span className="inline-flex rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                          {entry.type}
                        </span>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                  <div className="text-zinc-700 dark:text-zinc-200 md:contents">
                    <LocalizedText translations={entry.translations} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
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

  const dialogsContent = (
    <div className="space-y-4">
      {lessonData.dialogs?.length ? (
        <div className="space-y-4">
          {lessonData.dialogs.map((dialog, index) => {
            const dialogNumber = dialog.id ?? index + 1;
            const dialogAudioSrc = `/data/${languageId}/${courseId}/${levelId}/${lessonAudioId}-dialog${dialogNumber}.mp3`;
            const dialogAudioId = `${languageId}-${courseId}-${levelId}-${lessonAudioId}`;

            return (
              <div
                key={dialog.id ?? index}
                className="space-y-3 rounded-xl bg-white shadow-sm dark:bg-zinc-900/40"
              >
                <details className="group">
                  <summary className="cursor-pointer list-none rounded-xl px-4 py-3 outline-none transition hover:bg-zinc-50 dark:hover:bg-zinc-950">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            {dialog.name?.text ?? (
                              <TranslatedText
                                id="lesson.dialogFallback"
                                fallback={`Dialog ${index + 1}`}
                                values={{ number: index + 1 }}
                              />
                            )}
                          </p>
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            {dialog.name?.pronunciation
                              ? `[${dialog.name.pronunciation}]`
                              : '—'}
                          </span>
                        </div>
                        <LocalizedText
                          as="p"
                          className="text-sm text-zinc-600 dark:text-zinc-300"
                          translations={dialog.name?.translations}
                        />
                      </div>
                      <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition dark:border-zinc-800 dark:text-zinc-400">
                        <svg
                          className="h-3.5 w-3.5 transition group-open:rotate-180"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </summary>
                  <div className="space-y-3 px-4 pb-4">
                    <ol className="space-y-3">
                      {dialog.sentences?.map((sentence, sentenceIndex) => (
                        <li
                          key={`${sentence.text}-${sentenceIndex}`}
                          className="rounded-lg border border-zinc-100 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950"
                        >
                          <DialogSentenceWithHighlights
                            text={sentence.text}
                            pronunciation={sentence.pronunciation}
                            translations={sentence.translations}
                            newWords={lessonData.newWords ?? []}
                            textClassName="text-lg font-medium text-zinc-900 dark:text-zinc-100"
                          />
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
                <div className="px-4 pb-4">
                  <div className="rounded-lg border border-zinc-100 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950">
                    <DialogAudioPlayer
                      className="w-full"
                      groupId={dialogAudioId}
                      src={dialogAudioSrc}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          <TranslatedText
            id="lesson.noDialogs"
            fallback="No dialogs available for this lesson yet."
          />
        </p>
      )}
    </div>
  );

  const grammarContent = (
    <div className="space-y-4">
      {lessonData.grammars?.length ? (
        <div className="space-y-4">
          {lessonData.grammars.map((grammarItem, index) => (
            <article
              key={`${grammarItem.grammar}-${index}`}
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
                      key={`${example.text}-${exampleIndex}`}
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
    </div>
  );

  const practiceAudioSrc = `/data/${languageId}/${courseId}/${levelId}/${lessonId}-practice.mp3`;
  const practiceContent = (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="rounded-lg border border-zinc-100 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950">
          <DialogAudioPlayer
            className="w-full"
            groupId={`${languageId}-${courseId}-${levelId}-${lessonId}-practice`}
            src={practiceAudioSrc}
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'new-words',
      label: <TranslatedText id="lesson.tab.newWords" fallback="New Words" />,
      content: newWordsContent,
    },
    {
      id: 'dialogs',
      label: <TranslatedText id="lesson.tab.dialogs" fallback="Dialogs" />,
      content: dialogsContent,
    },
    {
      id: 'grammar',
      label: <TranslatedText id="lesson.tab.grammar" fallback="Grammar" />,
      content: grammarContent,
    },
    {
      id: 'exercises',
      label: <TranslatedText id="lesson.tab.exercises" fallback="Exercises" />,
      content: practiceContent,
    },
    {
      id: 'games',
      label: <TranslatedText id="lesson.tab.games" fallback="Games" />,
      content: (
        <GamesTab
          words={lessonData.newWords ?? []}
          storageKey={`langgo.flashcard.${languageId}.${levelId}.${lessonId}`}
        />
      ),
    },
  ];

  const lessonIndex = level.lessons.findIndex((entry) => entry.id === lessonId);
  const prevLesson = level.lessons[lessonIndex - 1];
  const nextLesson = level.lessons[lessonIndex + 1];
  const prevLink: LessonNavLink | undefined = prevLesson
    ? {
        href: `/languages/${languageId}/${courseId}/${levelId}/${prevLesson.id}`,
        label: prevLesson.label.text,
      }
    : undefined;
  const nextLink: LessonNavLink | undefined = nextLesson
    ? {
        href: `/languages/${languageId}/${courseId}/${levelId}/${nextLesson.id}`,
        label: nextLesson.label.text,
      }
    : undefined;
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <LocalizedText
              translations={language.label.translations}
              fallback={language.label.text}
            />{' '}
            ·{' '}
            <LocalizedText
              translations={course.label.translations}
              fallback={course.label.text}
            />{' '}
            ·{' '}
            <LocalizedText
              translations={level.label.translations}
              fallback={level.label.text}
            />{' '}
            ·{' '}
            <LocalizedText
              translations={lesson.label.translations}
              fallback={lesson.label.text}
            />
          </p>
          {prevLink || nextLink ? (
            <div className="hidden flex-wrap items-center gap-3 sm:flex">
              {prevLink ? (
                <Link
                  href={prevLink.href}
                  className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-white"
                >
                  <TranslatedText
                    id="learn.prevLesson"
                    fallback="Previous lesson"
                  />
                </Link>
              ) : undefined}
              {nextLink ? (
                <Link
                  href={nextLink.href}
                  className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  <TranslatedText
                    id="learn.nextLesson"
                    fallback="Next lesson"
                  />
                </Link>
              ) : undefined}
            </div>
          ) : undefined}
        </div>
        <LanguageText
          text={lessonData.title?.text ?? lesson.label.text}
          pronunciation={lessonData.title?.pronunciation}
          translations={lessonData.title?.translations}
          textClassName="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100"
        />
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/learn/${languageId}/${courseId}/${levelId}/${lessonId}`}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <TranslatedText id="lesson.learn" fallback="Learn" />
          </Link>
          {prevLink ? (
            <Link
              href={prevLink.href}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-white sm:hidden"
            >
              <TranslatedText
                id="learn.prevLesson"
                fallback="Previous lesson"
              />
            </Link>
          ) : undefined}
          {nextLink ? (
            <Link
              href={nextLink.href}
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white sm:hidden"
            >
              <TranslatedText id="learn.nextLesson" fallback="Next lesson" />
            </Link>
          ) : undefined}
        </div>
        {lesson.description ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            <LocalizedText
              translations={lesson.description.translations}
              fallback={lesson.description.text}
            />
          </p>
        ) : undefined}
      </header>
      <ContentTabs tabs={tabs} />
    </section>
  );
}
