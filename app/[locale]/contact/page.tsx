import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageFrame } from '@/components/page-frame'
import { PageTitle } from '@/components/page-title'
import { CopyEmail } from '@/components/copy-email'
import { CONTACT_LINKS } from '@/content/contact'
import { routing, type Locale } from '@/i18n/routing'
import { alternates } from '@/lib/alternates'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return { alternates: alternates(locale as Locale, '/contact') }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  return (
    <PageFrame page="contact">
      <PageTitle>{t('title')}</PageTitle>

      <section className="px-5 pt-16 pb-24 md:px-8 md:pt-24 md:pb-40">
        <div className="md:ml-[50%]">
          <p className="measure text-[clamp(1.25rem,1rem+1.1vw,2rem)] leading-[1.25] font-bold tracking-[-0.015em]">
            {t('lede')}
          </p>

          <div className="mt-10 text-[clamp(1.125rem,1rem+0.6vw,1.5rem)]">
            <CopyEmail />
          </div>

          <ul className="mt-10 flex flex-col gap-1">
            {CONTACT_LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-[clamp(1.5rem,1rem+2.5vw,3rem)] font-black tracking-[-0.02em] uppercase"
                  {...(link.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageFrame>
  )
}
