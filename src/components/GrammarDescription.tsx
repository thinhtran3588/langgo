'use client';

import { useI18n } from '@/components/I18nProvider';
import { resolveTranslation } from '@/lib/i18n';
import type { ElementType } from 'react';

type GrammarTranslations = {
  en?: string;
  vi?: string;
};

type GrammarDescriptionProps = {
  descriptions?: GrammarTranslations;
  fallback?: string;
  as?: ElementType;
  className?: string;
};

const stripInlineMarkdown = (value: string) =>
  value.replace(/\*\*/g, '').replace(/`/g, '');

const GrammarDescription = ({
  descriptions,
  fallback = '—',
  as = 'p',
  className,
}: GrammarDescriptionProps) => {
  const { locale } = useI18n();
  const rawValue = resolveTranslation(descriptions, locale) ?? fallback;
  const Component = as;

  return (
    <Component className={className}>
      {stripInlineMarkdown(rawValue)}
    </Component>
  );
};

export default GrammarDescription;
