import TranslatedText from '@/components/TranslatedText';
import { languages } from '@/lib/languages';
import Link from 'next/link';

export default function LanguagesPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          <TranslatedText id="languages.title" fallback="Languages" />
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          <TranslatedText id="languages.heading" fallback="All courses" />
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          <TranslatedText
            id="languages.desc"
            fallback="Choose a language to see levels and lessons."
          />
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {languages.map((language) => (
          <Link
            key={language.id}
            href={`/languages/${language.id}`}
            className="glass-card rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:scale-[1.01] dark:text-zinc-100"
          >
            {language.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
