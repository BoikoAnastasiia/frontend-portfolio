import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageFrame } from '@/components/page-frame'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  return (
    <PageFrame page="home">
      <section className="px-5 py-16 md:px-10 md:py-28">
        <h1 className="max-w-[18ch] text-[clamp(2.5rem,1.5rem+7vw,7rem)] leading-[0.95] font-black tracking-[-0.03em]">
          {t('headline')}
        </h1>
        <p className="mt-10 max-w-[46ch]">{t('lede')}</p>
      </section>
    </PageFrame>
  )
}
