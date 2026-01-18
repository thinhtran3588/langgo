import { languages } from '@/lib/languages';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Welcome
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Discover language courses tailored to your goals.
        </h1>
        <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
          Pick a course from the menu to get started. Lessons are organized by
          level so you can build confidence step by step.
        </p>
      </header>
      <div className="space-y-6">
        {languages.map((language) => (
          <section key={language.id} className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold">{language.label}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {language.description ?? 'Start learning today.'}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {language.levels.map((level) => (
                <Link
                  key={level.id}
                  href={`/languages/${language.id}/${level.id}`}
                  className="glass-card rounded-2xl p-4 transition hover:scale-[1.01]"
                >
                  <h3 className="text-lg font-semibold">{level.label}</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {level.description ??
                      language.description ??
                      'Start learning today.'}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
        {languages.length === 0 && (
          <div className="glass-card rounded-2xl p-4">
            <h2 className="text-lg font-semibold">Courses coming soon</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Check back later for new language lessons.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
