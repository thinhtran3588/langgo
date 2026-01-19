'use client';

import { useI18n } from '@/components/I18nProvider';
import type { ElementType } from 'react';

type LocalizedTranslations = {
  en?: string;
  vi?: string;
};

type LocalizedTextProps = {
  translations?: LocalizedTranslations;
  fallback?: string;
  as?: ElementType;
  className?: string;
};

const LocalizedText = ({
  translations,
  fallback = '—',
  as = 'span',
  className,
}: LocalizedTextProps) => {
  const { locale } = useI18n();
  const Component = as;
  const value =
    translations?.[locale] ?? translations?.en ?? translations?.vi ?? fallback;

  return <Component className={className}>{value}</Component>;
};

export default LocalizedText;
