'use client';

import { useI18n } from '@/components/I18nProvider';
import { languages } from '@/lib/languages';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

function NavList({
  items,
  depth = 0,
  pathname,
  expandedItems,
  onToggle,
}: {
  items: NavItem[];
  depth?: number;
  pathname: string;
  expandedItems: Record<string, boolean>;
  onToggle: (key: string, nextExpanded: boolean) => void;
}) {
  const { t } = useI18n();

  return (
    <ul className={depth === 0 ? 'space-y-3' : 'space-y-2'}>
      {items.map((item) => {
        const itemKey = item.href ?? item.label;
        const isActive =
          item.href &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`));
        const hasChildren = Boolean(item.children?.length);
        const isExpanded = hasChildren
          ? (expandedItems[itemKey] ?? depth < 1)
          : false;
        return (
          <li
            key={`${item.label}-${item.href ?? 'group'}`}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? 'font-semibold text-primary'
                      : 'font-medium text-zinc-700 hover:bg-white/60 dark:text-zinc-300 dark:hover:bg-zinc-900/70'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="block flex-1 px-3 text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                  {item.label}
                </span>
              )}
              {hasChildren ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggle(itemKey, !isExpanded);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/70 dark:hover:text-zinc-100"
                  aria-label={
                    isExpanded
                      ? t('nav.hideItems', { label: item.label })
                      : t('nav.showItems', { label: item.label })
                  }
                  aria-expanded={isExpanded}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 transition ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : undefined}
            </div>
            {hasChildren && isExpanded ? (
              <div className="pl-3">
                <NavList
                  items={item.children ?? []}
                  depth={depth + 1}
                  pathname={pathname}
                  expandedItems={expandedItems}
                  onToggle={onToggle}
                />
              </div>
            ) : undefined}
          </li>
        );
      })}
    </ul>
  );
}

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();
  const resolveLabel = (value: {
    text: string;
    translations?: { en?: string; vi?: string };
  }) =>
    value.translations?.[locale] ??
    value.translations?.en ??
    value.translations?.vi ??
    value.text;

  const navItems: NavItem[] = [
    { label: t('nav.home'), href: '/' },
    ...languages.map((language) => ({
      label: resolveLabel(language.label),
      href: `/languages/${language.id}`,
      children: (language.courses ?? []).map((course) => ({
        label: resolveLabel(course.label),
        href: `/languages/${language.id}/${course.id}`,
        children: course.levels.map((level) => ({
          label: resolveLabel(level.label),
          href: `/languages/${language.id}/${course.id}/${level.id}`,
          children: level.lessons.map((lesson) => ({
            label: resolveLabel(lesson.label),
            href: `/languages/${language.id}/${course.id}/${level.id}/${lesson.id}`,
          })),
        })),
      })),
    })),
    { label: t('nav.about'), href: '/about' },
  ];
  const handleToggle = (key: string, nextExpanded: boolean) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: nextExpanded,
    }));
  };

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-50">
      <header className="sticky top-0 z-20">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
          <div className="glass-panel flex w-full items-center justify-between rounded-full px-4 py-3 shadow-[0_12px_35px_rgba(15,23,42,0.08)] sm:px-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/70 shadow-sm dark:bg-zinc-100">
                <Image
                  src="/logo.png"
                  alt="Langgo"
                  width={32}
                  height={32}
                  sizes="32px"
                  className="h-8 w-8 rounded-full object-contain"
                  priority
                  unoptimized
                />
              </span>
              <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Langgo
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <label htmlFor="language-picker" className="sr-only">
                {t('nav.language')}
              </label>
              <div className="relative">
                <select
                  id="language-picker"
                  value={locale}
                  onChange={(event) =>
                    setLocale(event.target.value as 'en' | 'vi')
                  }
                  className="appearance-none rounded-full border border-white/40 bg-white/40 px-3 py-1 pr-9 text-xs font-semibold tracking-wide text-zinc-700 shadow-sm transition hover:bg-white/70 dark:border-zinc-700/70 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="vi">🇻🇳 Tiếng Việt</option>
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600 dark:text-zinc-300"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/40 p-2 text-zinc-800 shadow-sm transition hover:bg-white/70 dark:border-zinc-700/70 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900 md:hidden"
                aria-expanded={menuOpen}
                aria-controls="primary-navigation"
              >
                <span className="sr-only">
                  {menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
                </span>
                {menuOpen ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6l-12 12" />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
        <aside
          id="primary-navigation"
          className={`glass-panel w-full rounded-2xl p-4 md:block md:w-64 ${
            menuOpen ? 'block' : 'hidden'
          }`}
        >
          <nav aria-label={t('nav.main')}>
            <NavList
              items={navItems}
              pathname={pathname}
              expandedItems={expandedItems}
              onToggle={handleToggle}
            />
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
