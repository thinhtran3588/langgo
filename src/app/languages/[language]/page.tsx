import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLanguage, languages } from '@/lib/languages';

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
          {language.label}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {language.label} courses
        </h1>
        {language.description ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {language.description}
          </p>
        ) : undefined}
      </header>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Levels
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {language.levels.map((level) => (
            <Link
              key={level.id}
              href={`/languages/${language.id}/${level.id}`}
              className="glass-card rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:scale-[1.01] dark:text-zinc-100"
            >
              {level.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          All languages
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {languages.map((item) => (
            <Link
              key={item.id}
              href={`/languages/${item.id}`}
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
