import LocalizedText from '@/components/LocalizedText';
import TranslatedText from '@/components/TranslatedText';
import { getLanguage } from '@/lib/languages';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type LanguagePageProps = {
  params: Promise<{
    language: string;
  }>;
};

export default async function LanguagePage({ params }: LanguagePageProps) {
  const { language: languageId } = await params;
  const language = getLanguage(languageId);

  if (!language) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          <LocalizedText
            translations={language.label.translations}
            fallback={language.label.text}
          />
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          <TranslatedText
            id="language.coursesHeading"
            fallback={`${language.label.text} courses`}
            values={{ language: language.label.text }}
          />
        </h1>
        {language.description ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            <LocalizedText
              translations={language.description.translations}
              fallback={language.description.text}
            />
          </p>
        ) : undefined}
      </header>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          <TranslatedText id="language.coursesLabel" fallback="Courses" />
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {language.courses.map((course) => (
            <Link
              key={course.id}
              href={`/languages/${language.id}/${course.id}`}
              className="glass-card rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:scale-[1.01] dark:text-zinc-100"
            >
              <LocalizedText
                translations={course.label.translations}
                fallback={course.label.text}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
