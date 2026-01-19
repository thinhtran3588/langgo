'use client';

import { useI18n } from '@/components/I18nProvider';
import { type TranslationsMap } from '@/lib/i18n';
import type { ElementType } from 'react';

type LocalizedValue = {
  text: string;
  translations?: TranslationsMap;
};

type LocalizedTranslatedTextProps = {
  id: string;
  values?: Record<string, string | number | LocalizedValue>;
  fallback?: string;
  as?: ElementType;
  className?: string;
};

const resolveLocalizedValue = (
  locale: 'en' | 'vi',
  value: string | number | LocalizedValue
) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return (
    value.translations?.[locale] ??
    value.translations?.en ??
    value.translations?.vi ??
    value.text
  );
};

const LocalizedTranslatedText = ({
  id,
  values,
  fallback,
  as = 'span',
  className,
}: LocalizedTranslatedTextProps) => {
  const { locale, t } = useI18n();
  const Component = as;
  const resolvedValues = values
    ? Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          resolveLocalizedValue(locale, value),
        ])
      )
    : undefined;

  return (
    <Component className={className}>
      {t(id, resolvedValues, fallback)}
    </Component>
  );
};

export default LocalizedTranslatedText;
