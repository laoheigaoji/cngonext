import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['cn', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'tw', 'it'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
