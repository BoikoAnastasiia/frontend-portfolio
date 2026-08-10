'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

type Theme = 'color' | 'mono'

/** Private browsing and blocked storage must not break the toggle. */
function persist(theme: Theme) {
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Preference simply will not survive a reload.
  }
}

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
    document.documentElement.dataset.theme = next
    persist(next)
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === 'mono'}
      aria-label={t('toggle')}
      className="inline-flex min-h-11 items-center gap-2 px-2 text-sm tracking-wide uppercase"
    >
      <span aria-hidden="true" className="text-base leading-none">
        {theme === 'mono' ? '◑' : '◐'}
      </span>
      <span>{t('label')}</span>
    </button>
  )
}
