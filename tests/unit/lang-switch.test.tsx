import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '@/messages/en.json'

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/projects',
  Link: ({
    children,
    href,
    locale,
    ...rest
  }: {
    children: React.ReactNode
    href: string
    locale?: string
    [key: string]: unknown
  }) => (
    <a href={`${!locale || locale === 'en' ? '' : '/' + locale}${href}`} {...rest}>
      {children}
    </a>
  ),
}))

const { LangSwitch } = await import('@/components/lang-switch')

function setup(current: 'en' | 'uk' | 'sk' = 'en') {
  return render(
    <NextIntlClientProvider locale={current} messages={messages}>
      <LangSwitch current={current} />
    </NextIntlClientProvider>,
  )
}

describe('LangSwitch', () => {
  it('offers all three locales', () => {
    setup()
    for (const code of ['EN', 'UK', 'SK']) {
      expect(screen.getByText(code)).toBeInTheDocument()
    }
  })

  it('marks only the active locale as current for assistive tech', () => {
    setup()
    expect(screen.getByText('EN').closest('a')).toHaveAttribute('aria-current', 'true')
    expect(screen.getByText('UK').closest('a')).not.toHaveAttribute('aria-current')
    expect(screen.getByText('SK').closest('a')).not.toHaveAttribute('aria-current')
  })

  it('preserves the current path when switching locale', () => {
    setup()
    expect(screen.getByText('SK').closest('a')).toHaveAttribute('href', '/sk/projects')
    expect(screen.getByText('UK').closest('a')).toHaveAttribute('href', '/uk/projects')
  })

  it('tags each link with hreflang and lang so screen readers switch voice', () => {
    setup()
    const uk = screen.getByText('UK').closest('a')!
    expect(uk).toHaveAttribute('hreflang', 'uk')
    expect(uk).toHaveAttribute('lang', 'uk')
  })

  it('exposes itself as a labelled navigation region', () => {
    setup()
    expect(screen.getByRole('navigation', { name: 'Language' })).toBeInTheDocument()
  })

  it('separators are hidden from assistive tech', () => {
    const { container } = setup()
    const seps = container.querySelectorAll('[aria-hidden="true"]')
    expect(seps.length).toBeGreaterThan(0)
  })
})
