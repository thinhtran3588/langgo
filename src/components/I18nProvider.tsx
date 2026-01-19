'use client';

import {
  defaultLocale,
  formatMessage,
  localeStorageKey,
  supportedLocales,
  translations,
  type Locale,
} from '@/lib/i18n';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (
    key: string,
    values?: Record<string, string | number>,
    fallback?: string
  ) => string;
  supportedLocales: Locale[];
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const listeners = new Set<() => void>();

const getStoredLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }
  try {
    const stored = localStorage.getItem(localeStorageKey);
    if (stored === 'en' || stored === 'vi') {
      return stored;
    }
  } catch {
    // Ignore storage failures (private mode or quota).
  }
  return defaultLocale;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (typeof window === 'undefined') {
    return () => {
      listeners.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === localeStorageKey) {
      listener();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const locale = useSyncExternalStore(
    subscribe,
    getStoredLocale,
    () => defaultLocale
  );

  const setLocale = useCallback((nextLocale: Locale) => {
    try {
      localStorage.setItem(localeStorageKey, nextLocale);
    } catch {
      // Ignore storage failures (private mode or quota).
    }
    listeners.forEach((listener) => listener());
  }, []);

  const t = useCallback(
    (
      key: string,
      values?: Record<string, string | number>,
      fallback?: string
    ) => {
      const message =
        translations[locale]?.[key] ??
        fallback ??
        translations[defaultLocale]?.[key] ??
        key;
      return formatMessage(message, values);
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      supportedLocales,
    }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
