import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageFrame } from '@/components/page-frame'
import { PageTitle } from '@/components/page-title'
import { CopyEmail } from '@/components/copy-email'
import { CONTACT_LINKS } from '@/content/contact'
import { routing, type Locale } from '@/i18n/routing'
import { pageMetadata } from '@/lib/page-metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return pageMetadata({
    locale: locale as Locale,
    path: '/contact',
    title: t('title').replace(/\.$/, ''),
    description: t('lede'),
  })
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
        {/* Two columns with no gap, so the text keeps the exact 50% edge it
            had as ml-[50%] and stays flush with the about page. */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-0">
          {/* Grayscale, multiplied onto the page ground, so the portrait reads
              as a duotone in the page ink rather than a photo pasted on top of
              it. Under the mono theme the ground is paper, so it stays grey.
              The brightness lift is measured, not taste: the studio backdrop
              sits at 0.945 luminance, and multiply leaves anything below 1 as
              a visible lighter rectangle. 1.06 clips it to white so the edge
              of the photograph disappears into the ground. */}
          <div className="md:pr-10">
            <Image
              src="/media/portrait.png"
              alt="Anastasiia Boiko"
              width={1254}
              height={1254}
              sizes="(min-width: 768px) 45vw, 100vw"
              priority
              className="h-auto w-full max-w-[26rem] mix-blend-multiply brightness-[1.06] grayscale contrast-[1.08]"
            />
          </div>

          <div>
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
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageFrame>
  )
}
