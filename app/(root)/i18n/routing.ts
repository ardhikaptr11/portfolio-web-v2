import { defineRouting, Pathnames } from 'next-intl/routing';

export const locales = ['en', 'id'] as const;

const pathnames = {
  '/': '/',
  '/projects': '/projects',
  '/projects/[slug]': '/projects/[slug]',
} satisfies Pathnames<typeof locales>;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "en",

  localePrefix: "as-needed",
  localeDetection: false,
  pathnames
});