import LocalizedText from '@/components/LocalizedText';
import TranslatedText from '@/components/TranslatedText';
import { getCourse, getLanguage } from '@/lib/languages';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type CoursePageProps = {
  params: Promise<{
    language: string;
    course: string;
  }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { language: languageId, course: courseId } = await params;
  const language = getLanguage(languageId);
  const course = getCourse(languageId, courseId);

  if (!language || !course) {
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
            translations={course.label.translations}
            fallback={course.label.text}
          />
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          <LocalizedText
            translations={course.label.translations}
            fallback={course.label.text}
          />
        </h1>
        {course.description ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            <LocalizedText
              translations={course.description.translations}
              fallback={course.description.text}
            />
          </p>
        ) : undefined}
      </header>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          <TranslatedText id="language.levelsHeading" fallback="Levels" />
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {course.levels.map((level) => (
            <Link
              key={level.id}
              href={`/languages/${language.id}/${course.id}/${level.id}`}
              className="glass-card rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:scale-[1.01] dark:text-zinc-100"
            >
              <LocalizedText
                translations={level.label.translations}
                fallback={level.label.text}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
