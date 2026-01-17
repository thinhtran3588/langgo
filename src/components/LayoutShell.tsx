'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { languages } from '@/lib/languages';

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  ...languages.map((language) => ({
    label: language.label,
    href: `/languages/${language.id}`,
    children: language.levels.map((level) => ({
      label: level.label,
      href: `/languages/${language.id}/${level.id}`,
      children: level.lessons.map((lesson) => ({
        label: lesson.label,
        href: `/languages/${language.id}/${level.id}/${lesson.id}`,
      })),
    })),
  })),
  { label: 'About', href: '/about' },
];

function NavList({
  items,
  depth = 0,
  pathname,
}: {
  items: NavItem[];
  depth?: number;
  pathname: string;
}) {
  return (
    <ul className={depth === 0 ? 'space-y-3' : 'space-y-2'}>
      {items.map((item) => {
        const isActive =
          item.href &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`));
        return (
          <li
            key={`${item.label}-${item.href ?? 'group'}`}
            className="space-y-2"
          >
            {item.href ? (
              <Link
                href={item.href}
                className={`block rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? 'font-semibold text-primary'
                    : 'font-medium text-zinc-700 hover:bg-white/60 dark:text-zinc-300 dark:hover:bg-zinc-900/70'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span className="block px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {item.label}
              </span>
            )}
            {item.children ? (
              <div className="pl-3">
                <NavList
                  items={item.children}
                  depth={depth + 1}
                  pathname={pathname}
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
  const pathname = usePathname();

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-50">
      <header className="sticky top-0 z-20">
        <div className="glass-panel mx-auto flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-3 shadow-[0_12px_35px_rgba(15,23,42,0.08)] sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-white via-white/70 to-blue-100 text-sm font-semibold text-zinc-900 shadow-sm dark:from-zinc-100 dark:via-white dark:to-slate-200">
              L
            </span>
            <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Langgo
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/40 p-2 text-zinc-800 shadow-sm transition hover:bg-white/70 dark:border-zinc-700/70 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            <span className="sr-only">
              {menuOpen ? 'Close menu' : 'Open menu'}
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
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
        <aside
          id="primary-navigation"
          className={`glass-panel w-full rounded-2xl p-4 md:block md:w-64 ${
            menuOpen ? 'block' : 'hidden'
          }`}
        >
          <nav aria-label="Main">
            <NavList items={navItems} pathname={pathname} />
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
