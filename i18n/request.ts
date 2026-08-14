import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing, type Locale } from './routing'
import en from '../messages/en.json'
import uk from '../messages/uk.json'
import sk from '../messages/sk.json'

/**
 * Static imports, not `import(\`../messages/${locale}.json\`)`.
 *
 * A dynamic import built from a template literal is opaque to the bundler: in
 * development Turbopack cannot tell which file the expression will resolve to,
 * so editing a messages file does not invalidate the module and the dev server
 * keeps serving the bundle it first loaded. That surfaces as MISSING_MESSAGE
 * for every newly added key until the server is restarted, while the
 * production build — which resolves the same import at build time — is
 * perfectly correct. Naming the three files outright makes them ordinary
 * dependencies that hot-reload like any other module.
 */
const MESSAGES: Record<Locale, typeof en> = { en, uk, sk }

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return { locale, messages: MESSAGES[locale] }
})
