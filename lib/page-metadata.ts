import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'

const OG_ALT = 'Anastasiia Boiko — Front-End Developer'

/**
 * The per-route metadata block: canonical, hreflang, and the Open Graph title
 * and description a link unfurl actually shows.
 *
 * Both halves have to be built per route rather than once in the locale layout.
 * Next merges layout metadata into every child, and `openGraph` is inherited
 * whole — so a page that sets only `title` keeps the layout's `og:title`. That
 * is why every URL on this site used to unfurl as the home page even though its
 * <title> was correct, and why every page claimed the locale root as canonical.
 *
 * `path` is the route inside the locale, leading slash, no locale prefix.
 */
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
}: {
  locale: Locale
  path?: string
  title?: string
  description?: string
}): Metadata {
  const href = (l: Locale) => (l === routing.defaultLocale ? path || '/' : `/${l}${path}`)

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: href(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, href(l)])),
    },
    openGraph: {
      type: 'website',
      locale,
      url: href(locale),
      /* Referenced outright rather than via the opengraph-image file
         convention: that convention attaches to a route segment, and with
         every page under app/[locale] and no root layout it produced a served
         image that no page ever linked to. Resolved against metadataBase. */
      images: [{ url: '/og.png', width: 1200, height: 630, alt: OG_ALT }],
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    },
    ...(title || description
      ? {
          twitter: {
            card: 'summary_large_image',
            images: ['/og.png'],
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
          },
        }
      : {}),
  }
}
