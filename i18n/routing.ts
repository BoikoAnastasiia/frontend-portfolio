import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'uk', 'sk'],
  defaultLocale: 'en',
  // English stays at the root: the URL pasted into application forms is
  // boiko.dev, not boiko.dev/en.
  localePrefix: 'as-needed',
  // Never bounce someone off a URL they were sent.
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
