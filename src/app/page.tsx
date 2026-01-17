import Link from 'next/link';

export default function Home() {
  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Welcome
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Learn Chinese and English with focused lessons.
        </h1>
        <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
          Pick a course from the menu to get started. Lessons are organized by
          level so you can build confidence step by step.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/languages/chinese/hsk1"
          className="glass-card rounded-2xl p-4 transition hover:scale-[1.01]"
        >
          <h2 className="text-lg font-semibold">Chinese HSK1</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Start with beginner vocabulary and sentence patterns.
          </p>
        </Link>
        <Link
          href="/languages/english/level-1"
          className="glass-card rounded-2xl p-4 transition hover:scale-[1.01]"
        >
          <h2 className="text-lg font-semibold">English Level 1</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Practice everyday phrases and key grammar foundations.
          </p>
        </Link>
      </div>
    </section>
  );
}
