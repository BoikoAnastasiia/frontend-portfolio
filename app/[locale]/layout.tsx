import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Podkova } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'
import { ThemeScript } from '@/components/theme-script'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RevealFallback } from '@/components/reveal-fallback'
import '@/styles/globals.css'

const slab = Podkova({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  // Podkova's variable range is 400-800; there is no hairline below 400.
  weight: ['400', '500', '700', '800'],
  display: 'swap',
  variable: '--font-slab',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })
  const home = await getTranslations({ locale, namespace: 'home' })

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${t('name')} — ${t('role')}`,
      template: `%s — ${t('name')}`,
    },
    description: home('lede'),
    /* No alternates here: layout metadata is merged into every child, so a
       canonical declared at this level makes each page claim to be the locale
       root. Each route supplies its own via lib/alternates.ts. */
    openGraph: {
      type: 'website',
      locale,
      title: `${t('name')} — ${t('role')}`,
      description: home('lede'),
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  /*
   * ThemeScript and PageFrame both write attributes onto <html> before React
   * hydrates — that is the whole point, it is what stops the flash of the
   * wrong ground colour. React sees the server markup and the live DOM
   * disagree and logs a hydration mismatch. suppressHydrationWarning is the
   * supported escape hatch for exactly this case; it applies one level deep,
   * so only this element's own attributes are exempt.
   */
  return (
    <html
      lang={locale}
      data-theme="color"
      className={slab.variable}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <Header locale={locale} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <RevealFallback />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
