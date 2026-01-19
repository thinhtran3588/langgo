'use client';

import { useI18n } from '@/components/I18nProvider';

type TranslatedTextProps = {
  id: string;
  values?: Record<string, string | number>;
  fallback?: string;
  as?: keyof JSX.IntrinsicElements;
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
