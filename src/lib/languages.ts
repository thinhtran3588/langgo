import languagesData from '@/data/languages.json';

export type Lesson = {
  id: string;
  label: string;
  description?: string;
};

export type Level = {
  id: string;
  label: string;
  description?: string;
  lessons: Lesson[];
};

export type Language = {
  id: string;
  label: string;
  description?: string;
  levels: Level[];
};

type LanguagesConfig = {
  languages: Language[];
};

const { languages } = languagesData as LanguagesConfig;

export { languages };

const normalizeId = (value?: string) =>
  (value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');

export function getLanguage(id: string) {
  if (!id) return undefined;
  const normalizedId = normalizeId(id);
  return (
    languages.find((language) => normalizeId(language.id) === normalizedId) ??
    undefined
  );
}

export function getLevel(languageId: string, levelId: string) {
  const language = getLanguage(languageId);
  if (!language) return undefined;
  const normalizedLevelId = normalizeId(levelId);
  return (
    language.levels.find(
      (level) => normalizeId(level.id) === normalizedLevelId
    ) ?? undefined
  );
}

export function getLesson(
  languageId: string,
  levelId: string,
  lessonId: string
) {
  const level = getLevel(languageId, levelId);
  if (!level) return undefined;
  const normalizedLessonId = normalizeId(lessonId);
  return (
    level.lessons.find(
      (lesson) => normalizeId(lesson.id) === normalizedLessonId
    ) ?? undefined
  );
}
