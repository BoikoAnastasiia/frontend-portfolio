import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LangSwitch } from './lang-switch'
import type { Locale } from '@/i18n/routing'

const NAV = [
  { href: '/', key: 'home' },
  { href: '/projects', key: 'projects' },
  { href: '/about', key: 'about' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
] as const

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations('nav')

  return (
    <header className="px-5 pt-5 md:px-8 md:pt-7">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2"
        style={{ background: 'var(--ground)', color: 'var(--figure)' }}
      >
        {t('skipToContent')}
      </a>

      {/* The rule that opens every page. */}
      <hr className="rule" />

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-3 pb-4 md:pt-4">
        {/* No separate wordmark: it linked to "/" exactly as the first nav item
            does, so the row carried the same destination twice. */}
        <nav aria-label={t('main')} className="flex-1">
          <ul className="flex flex-wrap items-baseline gap-x-6 md:justify-between md:pr-6">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-sm font-bold tracking-[-0.01em] uppercase no-underline hover:underline md:text-base"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <LangSwitch current={locale} />
      </div>
    </header>
  )
}
