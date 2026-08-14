import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'

/**
 * The canonical and hreflang block for one page.
 *
 * It has to be built per route. Declaring it once in the locale layout looks
 * tidy but is wrong: Next merges layout metadata into every child, so each
 * page inherited the locale root as its canonical and told search engines that
 * /projects, /blog and every project page were duplicates of the home page.
 *
 * `path` is the route inside the locale, with a leading slash and no locale
 * prefix — '' for the locale's own root.
 */
export function alternates(locale: Locale, path = ''): Metadata['alternates'] {
  const href = (l: Locale) => (l === routing.defaultLocale ? path || '/' : `/${l}${path}`)

  return {
    canonical: href(locale),
    languages: Object.fromEntries(routing.locales.map((l) => [l, href(l)])),
  }
}
