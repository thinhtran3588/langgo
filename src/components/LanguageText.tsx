'use client';

import { useState } from 'react';

type LanguageTextProps = {
  text: string;
  pronunciation?: string;
  translation?: string;
  className?: string;
  textClassName?: string;
  metaClassName?: string;
};

export default function LanguageText({
  text,
  pronunciation,
  translation,
  className,
  textClassName,
  metaClassName,
}: LanguageTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = Boolean(pronunciation || translation);

  return (
    <div className={`space-y-1 ${className ?? ''}`.trim()}>
      <div className="flex items-start gap-2">
        <span
          className={
            textClassName ??
            'text-base font-semibold text-zinc-900 dark:text-zinc-100'
          }
        >
          {text}
        </span>
        {hasDetails ? (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Hide details' : 'Show details'}
            className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
          >
            <svg
              className={`h-3.5 w-3.5 transition ${
                isExpanded ? 'rotate-180' : ''
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : undefined}
      </div>
      {hasDetails && isExpanded ? (
        <div
          className={`space-y-1 text-xs text-zinc-500 dark:text-zinc-400 ${
            metaClassName ?? ''
          }`.trim()}
        >
          {pronunciation ? <p>{pronunciation}</p> : undefined}
          {translation ? <p>{translation}</p> : undefined}
        </div>
      ) : undefined}
    </div>
  );
}
