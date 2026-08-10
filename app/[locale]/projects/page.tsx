import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageFrame } from '@/components/page-frame'
import { PageTitle } from '@/components/page-title'
import { StackChips } from '@/components/stack-chips'
import { Gallery } from '@/components/gallery'
import { PROJECTS } from '@/content/projects'
import { routing } from '@/i18n/routing'

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

      <section className="px-5 pt-16 md:px-8 md:pt-24">
        <ul className="flex flex-col">
          {PROJECTS.map((project) => (
            <li key={project.slug} data-reveal
              className="border-t py-8 first:border-t-0 md:py-12">
              <div className="grid gap-4 md:grid-cols-2 md:gap-10">
                <h2 className="text-[clamp(1.75rem,1rem+3vw,3.5rem)] leading-[1.02] font-black tracking-[-0.025em]">
                  {project.title}
                </h2>

                <div>
                  <p className="text-[clamp(1.0625rem,1rem+0.4vw,1.25rem)] leading-[1.4]">
                    {t(`${project.slug}.long`)}
                  </p>

                  <div className="mt-5">
                    <StackChips ids={project.tech} />
                  </div>

                  <p className="mt-4 flex flex-wrap gap-x-6">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-bold"
                      >
                        {t('live')} ↗
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-bold"
                      >
                        {t('repo')} ↗
                      </a>
                    )}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Gallery />
    </PageFrame>
  )
}
