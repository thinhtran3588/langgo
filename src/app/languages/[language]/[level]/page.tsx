import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLanguage, getLevel } from '@/lib/languages';

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
          {language.label} · {level.label}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {level.label} lessons
        </h1>
        {level.description ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {level.description}
          </p>
        ) : undefined}
      </header>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Lessons
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {level.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/languages/${language.id}/${level.id}/${lesson.id}`}
              className="glass-card rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:scale-[1.01] dark:text-zinc-100"
            >
              {lesson.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Levels in {language.label}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {language.levels.map((item) => (
            <Link
              key={item.id}
              href={`/languages/${language.id}/${item.id}`}
              className="glass-card rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:scale-[1.01] dark:text-zinc-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
