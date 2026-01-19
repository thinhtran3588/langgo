import languagesData from '@/data/languages.json';

export type LocalizedField = {
  text: string;
  translations?: {
    en?: string;
    vi?: string;
  };
};

export type Lesson = {
  id: string;
  label: LocalizedField;
  description?: LocalizedField;
};

export type Course = {
  id: string;
  label: LocalizedField;
  description?: LocalizedField;
  levels: Level[];
};

export type Level = {
  id: string;
  label: LocalizedField;
  description?: LocalizedField;
  lessons: Lesson[];
};

export type Language = {
  id: string;
  label: LocalizedField;
  description?: LocalizedField;
  courses: Course[];
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
  if (!id) return languages[0];
  const normalizedId = normalizeId(id);
  const match =
    languages.find((language) => normalizeId(language.id) === normalizedId) ??
    undefined;
  return match ?? languages[0];
}

export function getCourse(languageId: string, courseId: string) {
  const language = getLanguage(languageId);
  if (!language) return undefined;
  if (!courseId) {
    return language.courses[0];
  }
  const normalizedCourseId = normalizeId(courseId);
  const match =
    language.courses.find(
      (course) => normalizeId(course.id) === normalizedCourseId
    ) ?? undefined;
  return match ?? language.courses[0];
}

export function getLevel(
  languageId: string,
  courseId: string,
  levelId: string
) {
  const course = getCourse(languageId, courseId);
  if (!course) return undefined;
  const normalizedLevelId = normalizeId(levelId);
  return (
    course.levels.find(
      (level) => normalizeId(level.id) === normalizedLevelId
    ) ?? undefined
  );
}

export function getLesson(
  languageId: string,
  courseId: string,
  levelId: string,
  lessonId: string
) {
  const level = getLevel(languageId, courseId, levelId);
  if (!level) return undefined;
  const normalizedLessonId = normalizeId(lessonId);
  return (
    level.lessons.find(
      (lesson) => normalizeId(lesson.id) === normalizedLessonId
    ) ?? undefined
  );
}
