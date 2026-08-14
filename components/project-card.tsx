import { Link } from '@/i18n/navigation'
import { StackChips } from '@/components/stack-chips'
import type { Project } from '@/content/projects'

/**
 * The project's specification, set as three ruled rows on paper the way a
 * printed case study opens: what it is, what the job was, then the account of
 * it. The left column stays narrow so the right one reads as a single measure.
 */
export function ProjectCard({
  project,
  short,
  long,
  scope,
  liveLabel,
  repoLabel,
  href,
}: {
  project: Project
  short: string
  long: string
  scope?: string
  liveLabel: string
  repoLabel: string
  /** When set, the title links through. The card is never one big link: the
      stack chips are focusable, and nesting them inside an anchor breaks both
      keyboard order and the HTML. */
  href?: string
}) {
  const row = 'grid gap-x-10 gap-y-2 px-5 py-6 md:grid-cols-[1fr_1.4fr] md:px-8 md:py-7'

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink-key)' }}>
      <div className={`${row} border-b`}>
        <h2 className="text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-[1.1] font-black tracking-[-0.02em]">
          {href ? (
            <Link href={href} className="no-underline hover:underline">
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h2>
        <p className="text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-[1.15] italic">
          {short}
        </p>
      </div>

      <div className={`${row} border-b`}>
        <p className="text-[clamp(1.0625rem,1rem+0.5vw,1.375rem)] leading-[1.2]">
          {scope}
        </p>
        <div>
          <StackChips ids={project.tech} />
          <p className="mt-5 flex flex-wrap gap-x-6">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className="font-bold">
                {liveLabel} ↗
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer noopener" className="font-bold">
                {repoLabel} ↗
              </a>
            )}
          </p>
        </div>
      </div>

      <div className={row}>
        <p aria-hidden="true" />
        <p className="text-[clamp(1.0625rem,1rem+0.4vw,1.25rem)] leading-[1.45]">{long}</p>
      </div>
    </div>
  )
}
