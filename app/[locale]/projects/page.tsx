import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageFrame } from '@/components/page-frame'
import { PageTitle } from '@/components/page-title'
import { Gallery } from '@/components/gallery'
import { ProjectList } from '@/components/project-list'
import { routing, type Locale } from '@/i18n/routing'
import { pageMetadata } from '@/lib/page-metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })
  return pageMetadata({
    locale: locale as Locale,
    path: '/projects',
    title: t('title').replace(/\.$/, ''),
    description: t('graphicsLede'),
  })
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('projects')

  return (
    <PageFrame page="projects">
      <PageTitle>{t('title')}</PageTitle>

      <section className="pt-16 pb-8 md:pt-24">
        <ProjectList skipFirstFade />
      </section>

      <Gallery />
    </PageFrame>
  )
}
