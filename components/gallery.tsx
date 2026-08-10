import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { GRAPHICS } from '@/content/graphics'

/**
 * Renders nothing until there is work to show, so the page never displays an
 * empty section header while the exports are pending.
 */
export async function Gallery() {
  if (GRAPHICS.length === 0) return null

  const t = await getTranslations('projects')

  return (
    <section className="px-5 pt-20 pb-24 md:px-8 md:pt-32 md:pb-40">
      <hr className="rule" />
      <h2 className="poster pt-2">{t('graphicsTitle')}</h2>
      <p className="measure mt-8 text-[clamp(1.0625rem,1rem+0.4vw,1.25rem)] md:ml-[50%]">
        {t('graphicsLede')}
      </p>

      <ul className="mt-12 gap-4 [column-count:1] sm:[column-count:2] lg:[column-count:3]">
        {GRAPHICS.map((item) => (
          <li key={item.src} className="mb-4 break-inside-avoid" data-reveal>
            <Image
              src={item.src}
              width={item.width}
              height={item.height}
              alt={item.alt}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
