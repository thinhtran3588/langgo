import { notFound } from 'next/navigation';
import { getLanguage, getLevel, getLesson } from '@/lib/languages';

type LessonPageProps = {
  params: Promise<{
    language: string;
    level: string;
    lesson: string;
  }>;
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

  if (!language || !level || !lesson) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {language.label} · {level.label}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {lesson.label}
        </h1>
        {lesson.description ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {lesson.description}
          </p>
        ) : undefined}
      </header>
      <div className="rounded-lg border border-dashed border-zinc-200 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        Lesson content coming soon.
      </div>
    </section>
  );
}
