import LevelOverviewTabs from '@/components/LevelOverviewTabs';
import LocalizedText from '@/components/LocalizedText';
import TranslatedText from '@/components/TranslatedText';
import { getCourse, getLanguage, getLevel } from '@/lib/languages';
import { notFound } from 'next/navigation';

type LevelPageProps = {
  params: Promise<{
    language: string;
    course: string;
    level: string;
  }>;
};

export default async function LevelPage({ params }: LevelPageProps) {
  const {
    language: languageId,
    course: courseId,
    level: levelId,
  } = await params;
  const language = getLanguage(languageId);
  const course = getCourse(languageId, courseId);
  const level = getLevel(languageId, courseId, levelId);

  if (!language || !course || !level) {
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
      <LevelOverviewTabs
        languageId={language.id}
        courseId={course.id}
        levelId={level.id}
        lessons={level.lessons}
      />
    </section>
  );
}
