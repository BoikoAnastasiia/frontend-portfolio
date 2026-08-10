import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

/**
 * Rewrites `/` to the default locale. Required by localePrefix: 'as-needed',
 * and the only code on this site that runs at request time.
 *
 * Next 16 renamed the `middleware` file convention to `proxy`.
 */
export default createMiddleware(routing)

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
