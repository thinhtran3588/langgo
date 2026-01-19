import TranslatedText from '@/components/TranslatedText';

export default function AboutPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        <TranslatedText id="about.title" fallback="About Langgo" />
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        <TranslatedText
          id="about.body"
          fallback="Langgo is a simple learning space for structured language lessons. Navigate through the course menu to find each lesson."
        />
      </p>
    </section>
  );
}
