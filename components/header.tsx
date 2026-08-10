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
  const site = await getTranslations('site')

  return (
    <header className="px-5 pt-5 md:px-10 md:pt-8">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2"
        style={{ background: 'var(--ground)', color: 'var(--figure)' }}
      >
        {t('skipToContent')}
      </a>

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <Link
          href="/"
          className="text-lg leading-none font-black tracking-[-0.02em] uppercase no-underline sm:text-xl"
        >
          {site('name')}
        </Link>
        <LangSwitch current={locale} />
      </div>

      <nav aria-label={t('main')} className="mt-2 md:mt-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-0 sm:gap-x-8">
          {NAV.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center text-sm tracking-wide uppercase sm:text-base"
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
