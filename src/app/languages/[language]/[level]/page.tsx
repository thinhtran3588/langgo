import LocalizedText from '@/components/LocalizedText';
import TranslatedText from '@/components/TranslatedText';
import { getLanguage, getLevel } from '@/lib/languages';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type LevelPageProps = {
  params: Promise<{
    language: string;
    level: string;
  }>;
};

export default async function LevelPage({ params }: LevelPageProps) {
  const { language: languageId, level: levelId } = await params;
  const language = getLanguage(languageId);
  const level = getLevel(languageId, levelId);

  if (!language || !level) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          <LocalizedText
            translations={language.label.translations}
            fallback={language.label.text}
          />{' '}
          ·{' '}
          <LocalizedText
            translations={level.label.translations}
            fallback={level.label.text}
          />
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          <TranslatedText
            id="level.lessonsHeading"
            fallback={`${level.label.text} lessons`}
            values={{ level: level.label.text }}
          />
        </h1>
        {level.description ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            <LocalizedText
              translations={level.description.translations}
              fallback={level.description.text}
            />
          </p>
        ) : undefined}
      </header>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          <TranslatedText id="level.lessonsLabel" fallback="Lessons" />
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {level.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/languages/${language.id}/${level.id}/${lesson.id}`}
              className="glass-card rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:scale-[1.01] dark:text-zinc-100"
            >
              <LocalizedText
                translations={lesson.label.translations}
                fallback={lesson.label.text}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          <TranslatedText
            id="level.levelsInLanguage"
            fallback={`Levels in ${language.label.text}`}
            values={{ language: language.label.text }}
          />
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {language.levels.map((item) => (
            <Link
              key={item.id}
              href={`/languages/${language.id}/${item.id}`}
              className="glass-card rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:scale-[1.01] dark:text-zinc-100"
            >
              <LocalizedText
                translations={item.label.translations}
                fallback={item.label.text}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
