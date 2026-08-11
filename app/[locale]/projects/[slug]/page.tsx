import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { PageFrame } from '@/components/page-frame'
import { PageTitle } from '@/components/page-title'
import { StackChips } from '@/components/stack-chips'
import { ProjectClipPlayer } from '@/components/project-clip'
import { ProjectEmbedFrame } from '@/components/project-embed'
import { Link } from '@/i18n/navigation'
import { PROJECTS } from '@/content/projects'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECTS.map((p) => ({ locale, slug: p.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug)
  if (!project) return {}
  const t = await getTranslations({ locale, namespace: 'projects' })
  return { title: project.title, description: t(`${slug}.short`) }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = PROJECTS.find((p) => p.slug === slug)
  if (!project) notFound()

  const t = await getTranslations('projects')

  return (
    <PageFrame page="projects">
      <PageTitle>{project.title}</PageTitle>

      <section className="px-5 pt-12 pb-24 md:px-8 md:pt-16 md:pb-40">
        <div className="md:ml-[50%]">
          <p className="measure text-[clamp(1.25rem,1rem+1.1vw,2rem)] leading-[1.25] font-bold tracking-[-0.015em] text-pretty">
            {t(`${slug}.short`)}
          </p>

          <p className="measure mt-6 text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] leading-[1.4]">
            {t(`${slug}.long`)}
          </p>

          <div className="mt-6">
            <StackChips ids={project.tech} />
          </div>

          <p className="mt-5 flex flex-wrap gap-x-6">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className="font-bold">
                {t('live')} ↗
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer noopener" className="font-bold">
                {t('repo')} ↗
              </a>
            )}
          </p>
        </div>
      </section>

      {project.media && project.media.length > 0 && (
        <section className="px-5 pb-24 md:px-8 md:pb-40">
          <hr className="rule" />
          <h2 className="pt-3 text-[clamp(1.25rem,1rem+1.1vw,2rem)] font-bold tracking-[-0.015em]">
            {t('inUse')}
          </h2>

          {project.media.map((item) =>
            item.kind === 'clip' ? (
              <ProjectClipPlayer
                key={item.id}
                clip={item}
                caption={t(`${slug}.media.${item.id}`)}
              />
            ) : (
              <ProjectEmbedFrame
                key={item.id}
                embed={item}
                caption={t(`${slug}.media.${item.id}`)}
                openLabel={t('openLive')}
              />
            ),
          )}
        </section>
      )}

      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <Link href="/projects" className="font-bold">
          ← {t('title')}
        </Link>
      </section>
    </PageFrame>
  )
}
