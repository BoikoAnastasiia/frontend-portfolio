import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Roboto_Slab } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { ThemeScript } from '@/components/theme-script'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
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

export const metadata: Metadata = {
  title: 'Anastasiia Boiko — Front-End Developer',
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

  return (
    <html lang={locale} data-theme="color" className={slab.variable}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
