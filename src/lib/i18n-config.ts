
export const i18n = {
  defaultLocale: 'ru',
  locales: ['ru'],
} as const;

export type Locale = (typeof i18n.locales)[number];
