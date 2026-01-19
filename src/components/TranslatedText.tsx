'use client';

import { useI18n } from '@/components/I18nProvider';
import type { ElementType } from 'react';

type TranslatedTextProps = {
  id: string;
  values?: Record<string, string | number>;
  fallback?: string;
  as?: ElementType;
  className?: string;
};

const TranslatedText = ({
  id,
  values,
  fallback,
  as = 'span',
  className,
}: TranslatedTextProps) => {
  const { t } = useI18n();
  const Component = as;

  return <Component className={className}>{t(id, values, fallback)}</Component>;
};

export default TranslatedText;
