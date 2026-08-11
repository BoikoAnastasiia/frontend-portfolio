import Image from 'next/image'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { PageFrame } from '@/components/page-frame'
import { PageTitle } from '@/components/page-title'
import { ProjectCard } from '@/components/project-card'
import { ProjectClipPlayer } from '@/components/project-clip'
import { ProjectEmbedFrame } from '@/components/project-embed'
import { ProjectScreens } from '@/components/project-shots'
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
      <PageTitle
        back={
          <Link
            href="/projects"
            aria-label={t('back')}
            className="inline-flex min-h-11 min-w-11 items-center text-[2rem] leading-none no-underline"
          >
            <span aria-hidden="true">←</span>
          </Link>
        }
      >
        {project.title}
      </PageTitle>

      <section className="px-5 pt-10 md:px-8 md:pt-14">
        <ProjectCard
          project={project}
          short={t(`${slug}.short`)}
          long={t(`${slug}.long`)}
          scope={project.scope ? t(project.scope) : undefined}
          liveLabel={t('live')}
          repoLabel={t('repo')}
        />
      </section>

      {/* The one screen that opens the page, full width under the block. */}
      {project.hero && (
        <section className="px-5 pt-5 md:px-8 md:pt-8">
          <Image
            src={project.hero}
            alt={`${project.title} — ${t('scene.home')}`}
            width={1100}
            height={688}
            priority
            sizes="(min-width: 768px) 92vw, 100vw"
            className="w-full"
          />
        </section>
      )}

      {project.media && project.media.length > 0 && (
        <section className="px-5 pt-16 pb-24 md:px-8 md:pt-24 md:pb-40">
          <hr className="rule" />
          <h2 className="pt-3 text-[clamp(1.25rem,1rem+1.1vw,2rem)] font-bold tracking-[-0.015em]">
            {t('inUse')}
          </h2>

          {project.media
            .filter((m) => m.kind === 'gallery')
            .map((item) => (
              <ProjectScreens
                key={item.id}
                gallery={item}
                title={project.title}
                caption={t(item.id)}
                label={(scene) => t(`scene.${scene}`)}
              />
            ))}

          {/* Clips run two to a row on a wide screen, one on a narrow one. */}
          {project.media.some((m) => m.kind === 'clip') && (
            <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-8">
              {project.media
                .filter((m) => m.kind === 'clip')
                .map((item) => (
                  <ProjectClipPlayer
                    key={item.id}
                    clip={item}
                    caption={t(`${slug}.media.${item.id}`)}
                  />
                ))}
            </div>
          )}

          {project.media
            .filter((m) => m.kind === 'embed')
            .map((item) => (
              <ProjectEmbedFrame
                key={item.id}
                embed={item}
                caption={t(`${slug}.media.${item.id}`)}
                openLabel={t('openLive')}
              />
            ))}
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
