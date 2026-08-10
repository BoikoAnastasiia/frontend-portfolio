'use client'

import { useTranslations } from 'next-intl'
import { Tooltip } from './tooltip'
import { TECH, type TechId } from '@/content/tech'
import { TECH_ICONS } from './tech-icons.generated'

/**
 * Chips share a cap height and take their natural width, so a glyph and a
 * wordmark can sit in the same row without either being distorted.
 */
function Chip({ id }: { id: TechId }) {
  const tech = TECH[id]
  const Icon = 'icon' in tech && tech.icon ? TECH_ICONS[tech.icon] : undefined
  // Wordmarks carry their weight in width; glyphs need real height to match.
  const height = 'kind' in tech && tech.kind === 'wordmark' ? 'h-[0.95rem]' : 'h-[1.6rem]'

  return (
    <Tooltip label={tech.name}>
      <span
        tabIndex={0}
        className="tech-chip inline-flex h-11 items-center justify-center px-1"
        style={{ ['--brand' as string]: tech.brand }}
      >
        <span className="sr-only">{tech.name}</span>
        {Icon ? (
          <Icon aria-hidden="true" className={`${height} w-auto`} />
        ) : (
          <span aria-hidden="true" className="text-sm font-bold tracking-wide uppercase">
            {tech.name}
          </span>
        )}
      </span>
    </Tooltip>
  )
}

export function StackChips({ ids }: { ids: readonly TechId[] }) {
  const t = useTranslations('projects')

  return (
    <ul aria-label={t('stack')} className="flex flex-wrap items-center gap-x-4 gap-y-0">
      {ids.map((id) => (
        <li key={id}>
          <Chip id={id} />
        </li>
      ))}
    </ul>
  )
}
