import { setRequestLocale, getTranslations } from 'next-intl/server'
import { type Locale } from '@/i18n/routing'
import { pageMetadata } from '@/lib/page-metadata'
import { PageFrame } from '@/components/page-frame'
import { Link } from '@/i18n/navigation'
import { ProjectList } from '@/components/project-list'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })
  const home = await getTranslations({ locale, namespace: 'home' })
  return pageMetadata({
    locale: locale as Locale,
    title: `${t('name')} — ${t('role')}`,
    description: home('lede'),
  })
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const p = await getTranslations('projects')

  return (
    <PageFrame page="home">
      {/* Name as a printed mark: bottom-left corner, flush to both edges. */}
      <section className="flex min-h-[calc(100dvh-9rem)] items-end px-5 pb-1 md:px-8 md:pb-2">
        <h1 className="poster poster-mark">
          Anastasiia
          <br />
          Boiko
        </h1>
      </section>

      {/* Running text sits in the right-hand column. */}
      <section className="px-5 pt-16 pb-24 md:px-8 md:pt-28 md:pb-40">
        <div className="md:ml-[50%]">
          <p className="measure text-[clamp(1.25rem,1rem+1.1vw,2rem)] leading-[1.25] font-bold tracking-[-0.015em] text-pretty">
            {t('headline')}
          </p>
          <p className="measure mt-8 text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] leading-[1.4]">
            {t('lede')}
          </p>
          <p className="mt-8">
            <Link
              href="/about"
              className="text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] font-bold"
            >
              {t('learnMore')}
            </Link>
          </p>
        </div>
      </section>

      <hr className="rule mx-5 md:mx-8" />

      <section className="px-5 pt-6 pb-8 md:px-8 md:pt-8">
        <h2 className="text-[clamp(1.25rem,1rem+1.1vw,2rem)] font-bold tracking-[-0.015em] md:ml-[50%]">
          {t('featured')}
        </h2>
      </section>

      <section className="pb-20">
        <ProjectList />
        <p className="mt-12 px-5 md:px-8 md:ml-[50%]">
          <Link href="/projects" className="text-lg font-bold">
            {t('allProjects')}
          </Link>
        </p>
      </section>

    </PageFrame>
  )
}
