'use server';

import type { Locale } from '@/lib/i18n-config';
import { i18n } from '@/lib/i18n-config';
import ruTranslations from '@/locales/ru.json';

// Type for the structure of your translation files
type Translations = typeof ruTranslations;

const loadedTranslations: { [key in Locale]?: Translations } = {
  ru: ruTranslations,
};

function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export async function getTranslations(locale: Locale) {
  const selectedTranslations = loadedTranslations[locale] || loadedTranslations[i18n.defaultLocale];

  if (!selectedTranslations) {
    // This should not happen if defaultLocale is always present
    throw new Error(`Translations for locale "${locale}" or default locale "${i18n.defaultLocale}" not found.`);
  }

  return {
    t: (key: string): string => {
      const value = getNestedValue(selectedTranslations, key);
      if (value === undefined) {
        console.warn(`[Server Translation] Key "${key}" not found for locale "${locale}". Returning key.`);
        return key;
      }
      return value;
    },
    locale: locale
  };
}
