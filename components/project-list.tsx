import { getTranslations } from 'next-intl/server'
import { ProjectCard } from '@/components/project-card'
import { ProjectStrip } from '@/components/project-strip'
import { PROJECTS, stripFor } from '@/content/projects'

/**
 * Every project, each as its block followed by its band of imagery. The same
 * sequence carries the home page and the projects page — the reference site
 * shows the identical run on both, and splitting them would mean maintaining
 * two ideas of what a project looks like.
 */
export async function ProjectList({
  /**
   * Skip the fade on the first block. A view() timeline has no way to know an
   * element was already on screen at load, so a block that starts partly
   * visible would sit permanently mid-fade until the reader scrolled. On the
   * projects page the first block is exactly that element.
   */
  skipFirstFade = false,
}: {
  skipFirstFade?: boolean
} = {}) {
  const t = await getTranslations('projects')

  return (
    <div className="flex flex-col gap-y-16 md:gap-y-24">
      {PROJECTS.map((project, i) => (
        <article key={project.slug} data-reveal-fade={skipFirstFade && i === 0 ? undefined : true}>
          <ProjectCard
            project={project}
            short={t(`${project.slug}.short`)}
            long={t(`${project.slug}.long`)}
            scope={project.scope ? t(project.scope) : undefined}
            liveLabel={t('live')}
            repoLabel={t('repo')}
            href={`/projects/${project.slug}`}
          />
          <ProjectStrip images={stripFor(project)} alt={project.title} />
        </article>
      ))}
    </div>
  )
}
