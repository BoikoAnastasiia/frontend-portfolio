import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Roboto_Slab } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'
import { ThemeScript } from '@/components/theme-script'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RevealFallback } from '@/components/reveal-fallback'
import '@/styles/globals.css'

const slab = Roboto_Slab({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  // 100 is the poster hairline; 400 body; 700/900 headings and chips.
  weight: ['100', '400', '700', '900'],
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
    alternates: {
      canonical: locale === routing.defaultLocale ? '/' : `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, l === routing.defaultLocale ? '/' : `/${l}`]),
      ),
    },
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
