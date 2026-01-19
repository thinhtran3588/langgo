'use client';

import DialogAudioPlayer from '@/components/DialogAudioPlayer';
import { useI18n } from '@/components/I18nProvider';
import LanguageText from '@/components/LanguageText';
import LocalizedText from '@/components/LocalizedText';
import type { TranslationsMap } from '@/lib/i18n';
import { useMemo, useState } from 'react';

type DialogSentence = {
  text: string;
  pronunciation?: string;
  translations?: TranslationsMap;
};

type DialogEntry = {
  id?: number;
  name?: {
    text: string;
    pronunciation?: string;
    translations?: TranslationsMap;
  };
  sentences?: DialogSentence[];
};

type DialogCard = {
  lesson: {
    id: string;
    text: string;
    translations?: TranslationsMap;
  };
  dialogNumber: number;
  dialog: DialogEntry;
};

type ReadDialogGameProps = {
  dialogs: DialogCard[];
  languageId?: string;
  courseId?: string;
  levelId?: string;
};

const getRandomIndex = (length: number, exclude?: number) => {
  if (length <= 1) {
    return length ? 0 : undefined;
  }
  const blockedIndex =
    exclude === undefined || exclude < 0 || exclude >= length
      ? undefined
      : exclude;
  let nextIndex = Math.floor(Math.random() * length);
  while (blockedIndex !== undefined && nextIndex === blockedIndex) {
    nextIndex = Math.floor(Math.random() * length);
  }
  return nextIndex;
};

const formatLessonAudioId = (lessonKey: string) =>
  lessonKey.replace(/^lesson(\d+)$/, (_match, value: string) => {
    const padded = value.padStart(2, '0');
    return `lesson${padded}`;
  });

const ReadDialogGame = ({
  dialogs,
  languageId,
  courseId,
  levelId,
}: ReadDialogGameProps) => {
  const { t } = useI18n();
  const validDialogs = useMemo(
    () => dialogs.filter((entry) => entry.dialog.sentences?.length),
    [dialogs]
  );
  const [dialogIndex, setDialogIndex] = useState<number | undefined>(() =>
    getRandomIndex(validDialogs.length)
  );
  const initialIndex = useMemo(
    () => getRandomIndex(validDialogs.length),
    [validDialogs.length]
  );
  const activeIndex =
    dialogIndex !== undefined && dialogIndex < validDialogs.length
      ? dialogIndex
      : initialIndex;
  const activeDialog = useMemo(
    () => (activeIndex === undefined ? undefined : validDialogs[activeIndex]),
    [activeIndex, validDialogs]
  );

  const audioSource =
    languageId &&
    courseId &&
    levelId &&
    activeDialog?.dialogNumber &&
    activeDialog.lesson.id
      ? `/data/${languageId}/${courseId}/${levelId}/${formatLessonAudioId(
          activeDialog.lesson.id
        )}-dialog${activeDialog.dialogNumber}.mp3`
      : undefined;

  if (!validDialogs.length || !activeDialog) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        {t('readDialog.empty')}
      </p>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="space-y-1">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {t('readDialog.title')}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          <LocalizedText
            translations={activeDialog?.lesson.translations}
            fallback={activeDialog?.lesson.text ?? t('readDialog.title')}
          />
        </p>
      </div>

      <div className="space-y-3">
        {activeDialog?.dialog.name ? (
          <LanguageText
            text={activeDialog.dialog.name.text}
            pronunciation={activeDialog.dialog.name.pronunciation}
            translations={activeDialog.dialog.name.translations}
            textClassName="text-base font-semibold text-zinc-900 dark:text-zinc-100"
          />
        ) : (
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {t('lesson.dialogFallback', { number: (activeIndex ?? 0) + 1 })}
          </p>
        )}
        <div className="space-y-2">
          {activeDialog?.dialog.sentences?.map((sentence, sentenceIndex) => (
            <div
              key={`${sentence.text}-${sentenceIndex}`}
              className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
            >
              <LanguageText
                text={sentence.text}
                pronunciation={sentence.pronunciation}
                translations={sentence.translations}
                textClassName="text-base font-medium text-zinc-900 dark:text-zinc-100"
              />
            </div>
          ))}
        </div>
      </div>

      {audioSource ? (
        <div className="rounded-lg border border-zinc-100 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950">
          <DialogAudioPlayer
            className="w-full"
            groupId={`read-dialog-${activeDialog.lesson.id}-${activeDialog.dialogNumber}`}
            src={audioSource}
          />
        </div>
      ) : undefined}

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            setDialogIndex((current) =>
              getRandomIndex(validDialogs.length, activeIndex ?? current)
            )
          }
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {t('readDialog.next')}
        </button>
      </div>
    </div>
  );
};

export default ReadDialogGame;
