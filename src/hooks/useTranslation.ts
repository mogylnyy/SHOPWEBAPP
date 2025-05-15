
'use client';

import { useParams } from 'next/navigation';
import type { Locale } from '@/lib/i18n-config';
import { i18n } from '@/lib/i18n-config';

// For simplicity, we'll directly use Russian translations.
// In a more complex setup with a single language, you might not even need this hook
// or load JSON files, but for consistency with the previous structure, we keep it minimal.
import ruTranslations from '@/locales/ru.json';

type TranslationKeys = keyof typeof ruTranslations;

// A simple key-path accessor.
// Example: getNestedValue({ a: { b: 'Hello' } }, 'a.b') => 'Hello'
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((currentObject, key) => {
    return currentObject && currentObject[key] !== undefined ? currentObject[key] : undefined;
  }, obj);
}


export function useTranslation(passedLocale?: Locale) {
  // With only one locale, `params.locale` will always be 'ru' or the default.
  // The `passedLocale` argument is kept for API consistency but isn't strictly necessary now.
  const params = useParams();
  const locale = passedLocale || (params.locale as Locale) || i18n.defaultLocale;

  // Since 'ru' is the only locale, we always use ruTranslations.
  const translations = ruTranslations;

  const t = (key: string): string => {
    const value = getNestedValue(translations, key as TranslationKeys);
    if (value === undefined) {
      console.warn(`Translation key "${key}" not found for locale "${locale}".`);
      return key; // Return the key itself if translation is missing
    }
    return value;
  };

  return { t, locale };
}
