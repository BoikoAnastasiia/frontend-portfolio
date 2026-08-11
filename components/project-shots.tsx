import Image from 'next/image'
import type { ProjectGallery } from '@/content/projects'

/**
 * A row of screens rather than one enormous one. Desktop captures sit two to a
 * row and phone captures four, which is roughly the same physical width for
 * both — a phone shown as wide as a laptop reads as a mistake.
 */
export function ProjectScreens({
  gallery,
  caption,
  title,
  label,
}: {
  gallery: ProjectGallery
  caption: string
  title: string
  /** Resolves a scene id to its human label. */
  label: (scene: string) => string
}) {
  const phone = gallery.view === 'mobile'

  return (
    <figure className="mt-12">
      <figcaption className="mb-4 text-[1.0625rem] font-bold">{caption}</figcaption>

      <ul
        className={`grid gap-5 md:gap-8 ${
          phone ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {gallery.items.map((item) => (
          <li key={item.src}>
            <Image
              src={item.src}
              alt={`${title} — ${label(item.scene)}`}
              width={phone ? 620 : 1100}
              height={phone ? 1342 : 688}
              sizes={
                phone
                  ? '(min-width: 768px) 22vw, 45vw'
                  : '(min-width: 768px) 44vw, 92vw'
              }
              className="w-full border"
              style={{ borderColor: 'var(--figure)' }}
            />
            <p className="mt-2 text-[0.9375rem] opacity-80">{label(item.scene)}</p>
          </li>
        ))}
      </ul>
    </figure>
  )
}
