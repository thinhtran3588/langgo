import { readFile } from 'fs/promises';
import path from 'path';
import ContentTabs from '@/components/ContentTabs';
import DialogAudioPlayer from '@/components/DialogAudioPlayer';
import LanguageText from '@/components/LanguageText';
import { getLanguage, getLesson, getLevel } from '@/lib/languages';
import { notFound } from 'next/navigation';

type LessonData = {
  title?: {
    text: string;
    pronunciation?: string;
    translation?: string;
  };
  newWords?: Array<{
    word: string;
    type?: string;
    pronunciation?: string;
    translation?: string;
  }>;
  grammars?: Array<{
    grammar: string;
    description?: string;
    examples?: Array<{
      text: string;
      pronunciation?: string;
      translation?: string;
    }>;
  }>;
  dialogs?: Array<{
    id?: number;
    name?: {
      text: string;
      pronunciation?: string;
      translation?: string;
    };
    sentences?: Array<{
      text: string;
      pronunciation?: string;
      translation?: string;
    }>;
  }>;
};

type LessonPageProps = {
  params: Promise<{
    language: string;
    level: string;
    lesson: string;
  }>;
};

const stripInlineMarkdown = (value: string) =>
  value.replace(/\*\*/g, '').replace(/`/g, '');

const readLessonData = async (
  languageId: string,
  levelId: string,
  lessonId: string
) => {
  const lessonPath = path.join(
    process.cwd(),
    'public',
    'data',
    languageId,
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
    level: levelId,
    lesson: lessonId,
  } = await params;
  const language = getLanguage(languageId);
  const level = getLevel(languageId, levelId);
  const lesson = getLesson(languageId, levelId, lessonId);
  const lessonData = await readLessonData(languageId, levelId, lessonId);

  if (!language || !level || !lesson || !lessonData) {
    notFound();
  }

  const newWordsContent = (
    <div className="space-y-4">
      {lessonData.newWords?.length ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {lessonData.newWords.length} items
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="hidden grid-cols-4 gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 md:grid">
              <span>Word</span>
              <span>Pronunciation</span>
              <span>Type</span>
              <span>Translation</span>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {lessonData.newWords.map((entry, index) => (
                <div
                  key={`${entry.word}-${index}`}
                  className="grid grid-cols-1 gap-3 px-4 py-4 text-sm text-zinc-700 dark:text-zinc-200 md:grid-cols-4 md:gap-2"
                >
                  <div className="flex items-center justify-between gap-3 md:block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400 md:hidden">
                      Word
                    </span>
                    <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {entry.word}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 md:block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400 md:hidden">
                      Pronunciation
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {entry.pronunciation ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 md:block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400 md:hidden">
                      Type
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
                  <div className="flex items-center justify-between gap-3 md:block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400 md:hidden">
                      Translation
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-200">
                      {entry.translation ?? '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          No new words available for this lesson yet.
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
            const dialogAudioSrc = `/data/${languageId}/${levelId}/${lessonId}-dialog${dialogNumber}.mp3`;
            const dialogAudioId = `${languageId}-${levelId}-${lessonId}`;

            return (
              <div
                key={dialog.id ?? index}
                className="space-y-3 rounded-xl bg-white shadow-sm dark:bg-zinc-900/40"
              >
                <details className="group">
                  <summary className="cursor-pointer list-none rounded-xl px-4 py-3 outline-none transition hover:bg-zinc-50 dark:hover:bg-zinc-950">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                          {dialog.name?.text ?? `Dialog ${index + 1}`}
                        </p>
                        {dialog.name?.pronunciation ? (
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {dialog.name.pronunciation}
                          </p>
                        ) : undefined}
                        {dialog.name?.translation ? (
                          <p className="text-sm text-zinc-600 dark:text-zinc-300">
                            {dialog.name.translation}
                          </p>
                        ) : undefined}
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
                          <LanguageText
                            text={sentence.text}
                            pronunciation={sentence.pronunciation}
                            translation={sentence.translation}
                            textClassName="text-base font-medium text-zinc-900 dark:text-zinc-100"
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
          No dialogs available for this lesson yet.
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
                {grammarItem.description ? (
                  <p className="mt-2 whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-300">
                    {stripInlineMarkdown(grammarItem.description)}
                  </p>
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
                        translation={example.translation}
                        textClassName="font-medium text-zinc-900 dark:text-zinc-100"
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
          No grammar notes available for this lesson yet.
        </p>
      )}
    </div>
  );

  const tabs = [
    { id: 'new-words', label: 'New Words', content: newWordsContent },
    { id: 'dialogs', label: 'Dialogs', content: dialogsContent },
    { id: 'grammar', label: 'Grammar', content: grammarContent },
  ];

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {language.label} · {level.label} · {lesson.label}
        </p>
        <LanguageText
          text={lessonData.title?.text ?? lesson.label}
          pronunciation={lessonData.title?.pronunciation}
          translation={lessonData.title?.translation}
          textClassName="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        />
        {lesson.description ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {lesson.description}
          </p>
        ) : undefined}
      </header>
      <ContentTabs tabs={tabs} />
    </section>
  );
}
