import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageFrame } from '@/components/page-frame'
import { PageTitle } from '@/components/page-title'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  return (
    <PageFrame page="about">
      <PageTitle statement>{t('title')}</PageTitle>

      <section className="px-5 pt-16 pb-24 md:px-8 md:pt-24 md:pb-40">
        <div className="md:ml-[50%]">
          <p className="measure text-[clamp(1.25rem,1rem+1.1vw,2rem)] leading-[1.25] font-bold tracking-[-0.015em]">
            {t('body')}
          </p>

          <p className="mt-6 text-sm tracking-[0.06em] uppercase">{t('stats')}</p>

          <p className="measure mt-10 text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] leading-[1.4]">
            {t('interest')}
          </p>

          {/* Five parallel clauses. Stacked, they read as the checklist they
              are; run together as a paragraph they lose the rhythm. */}
          <ul className="measure mt-8 space-y-2 text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] leading-[1.35]">
            {(t.raw('qualities') as string[]).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <p className="mt-10">
            <a
              href="/cv.pdf"
              className="text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] font-bold"
            >
              {t('cv')}
            </a>
          </p>
        </div>
      </section>
    </PageFrame>
  )
}
