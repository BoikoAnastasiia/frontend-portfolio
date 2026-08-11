'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

/**
 * Three inline links rather than a dropdown: it reads like a print colophon,
 * needs no JavaScript to open, and every option is one tap away on mobile.
 */
export function LangSwitch({ current }: { current: Locale }) {
  const t = useTranslations('lang')
  const pathname = usePathname()

  return (
    <nav aria-label={t('label')}>
      <ul className="flex items-center">
        {routing.locales.map((locale, i) => (
          <li key={locale} className="flex items-center">
            {i > 0 && (
              <span aria-hidden="true" className="opacity-50 select-none">
                ·
              </span>
            )}
            <Link
              href={pathname}
              locale={locale}
              lang={locale}
              hrefLang={locale}
              aria-current={locale === current ? 'true' : undefined}
              // The class list is a constant, and which locale is current is
              // expressed only by aria-current, with the styling hung off that
              // in CSS. A className computed from a prop is what React was
              // reporting a hydration mismatch on here.
              className="lang-link inline-flex min-h-11 min-w-11 items-center justify-center px-1 text-sm tracking-wider"
            >
              {locale.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
