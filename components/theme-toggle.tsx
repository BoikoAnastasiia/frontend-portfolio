'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Tooltip } from './tooltip'

type Theme = 'color' | 'mono'

/** Private browsing and blocked storage must not break the toggle. */
function persist(theme: Theme) {
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Preference simply will not survive a reload.
  }
}

/**
 * Four process inks in a square. Shown only as the destination of the switch,
 * so it keeps its colour even while the page is monochrome — it is a preview
 * of what you are about to turn on, not part of the current palette.
 */
function CmykMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="8" height="8" fill="var(--ink-cyan)" />
      <rect x="8" y="0" width="8" height="8" fill="var(--ink-magenta)" />
      <rect x="0" y="8" width="8" height="8" fill="var(--ink-yellow)" />
      <rect x="8" y="8" width="8" height="8" fill="var(--ink-key)" />
    </svg>
  )
}

/** A disc half filled: the mark for dropping to one ink. */
function MonoMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1a7 7 0 0 1 0 14Z" fill="currentColor" />
    </svg>
  )
}

/**
 * The control names what it will do, not what is already true. Labelling it
 * "Monochrome" while the page is monochrome reads as a status line, and the
 * reader cannot tell it is a switch at all.
 */
export function ThemeToggle() {
  const t = useTranslations('theme')
  const [theme, setTheme] = useState<Theme>('color')

  // The inline ThemeScript may already have applied 'mono' before hydration;
  // adopt whatever the document actually says rather than assuming 'color'.
  useEffect(() => {
    const applied = document.documentElement.dataset.theme
    if (applied === 'mono' || applied === 'color') setTheme(applied)
  }, [])

  function toggle() {
    const next: Theme = theme === 'color' ? 'mono' : 'color'
    const root = document.documentElement

    // Suppress the page-transition bleed for this one swap, then release it on
    // the next frame so navigation still animates.
    root.dataset.themeSwitching = ''
    root.dataset.theme = next
    requestAnimationFrame(() => {
      requestAnimationFrame(() => delete root.dataset.themeSwitching)
    })

    persist(next)
    setTheme(next)
  }

  const mono = theme === 'mono'

  /* The label alone reads as a heading for the palette rather than a control,
     so the tooltip says outright what pressing it does. */
  return (
    <Tooltip align="end" label={mono ? t('toColour') : t('toMono')}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={mono}
        aria-label={mono ? t('toColour') : t('toMono')}
        className="inline-flex min-h-11 items-center gap-2 px-2 text-sm tracking-wide uppercase"
      >
        <span aria-hidden="true" className="inline-flex leading-none">
          {mono ? <CmykMark /> : <MonoMark />}
        </span>
        <span>{mono ? t('colour') : t('mono')}</span>
      </button>
    </Tooltip>
  )
}
