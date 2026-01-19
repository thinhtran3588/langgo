import { readFile } from 'fs/promises';
import path from 'path';
import LearnLessonExperience from '@/components/LearnLessonExperience';
import { getCourse, getLanguage, getLesson, getLevel } from '@/lib/languages';
import { notFound } from 'next/navigation';

type LessonTranslations = {
  en?: string;
  vi?: string;
};

type LessonData = {
  title?: {
    text: string;
    pronunciation?: string;
    translations?: LessonTranslations;
  };
  newWords?: Array<{
    word: string;
    type?: string;
    pronunciation?: string;
    translations?: LessonTranslations;
    example?: {
      text: string;
      pronunciation?: string;
      translations?: LessonTranslations;
    };
  }>;
  dialogs?: Array<{
    id?: number;
    name?: {
      text: string;
      pronunciation?: string;
      translations?: LessonTranslations;
    };
    sentences?: Array<{
      text: string;
      pronunciation?: string;
      translations?: LessonTranslations;
    }>;
  }>;
};

type LearnPageProps = {
  params: Promise<{
    language: string;
    course: string;
    level: string;
    lesson: string;
  }>;
};


const readLessonData = async (
  languageId: string,
  courseId: string,
  levelId: string,
  lessonId: string
): Promise<LessonData | undefined> => {
  const lessonPath = path.join(
    process.cwd(),
    'public',
    'data',
    languageId,
    courseId,
    levelId,
    `${lessonId}.json`
  );

  try {
    const lessonRaw = await readFile(lessonPath, 'utf8');
    return JSON.parse(lessonRaw) as LessonData;
  } catch {
    return undefined;
  }
};

export default async function LearnPage({ params }: LearnPageProps) {
  const {
    language: languageId,
    course: courseId,
    level: levelId,
    lesson: lessonId,
  } = await params;
  const language = getLanguage(languageId);
  const course = getCourse(languageId, courseId);
  const level = getLevel(languageId, courseId, levelId);
  const lesson = getLesson(languageId, courseId, levelId, lessonId);
  const lessonData = await readLessonData(
    languageId,
    courseId,
    levelId,
    lessonId
  );

  if (!language || !course || !level || !lesson || !lessonData) {
    notFound();
  }

  return (
    <LearnLessonExperience
      languageId={languageId}
      courseId={courseId}
      levelId={levelId}
      lessonId={lessonId}
      lessonLabel={lesson.label}
      lessonData={lessonData}
    />
  );
}
