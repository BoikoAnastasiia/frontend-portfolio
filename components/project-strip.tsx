import Image from 'next/image'

/**
 * The band of imagery that follows a project block, edge to edge and butted
 * together with no gaps — the reference site runs its work as one continuous
 * strip rather than a grid of cards. Cropped to a fixed band height so a
 * desktop capture and a phone capture can sit side by side.
 */
export function ProjectStrip({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  if (images.length === 0) return null

  return (
    <div className="flex h-[clamp(11rem,30vw,26rem)] w-full">
      {images.map((src, i) => (
        <div key={src} className="relative min-w-0 flex-1">
          <Image
            src={src}
            /* One description for the band; the rest are the same subject. */
            alt={i === 0 ? alt : ''}
            fill
            sizes="(min-width: 768px) 34vw, 50vw"
            className="object-cover object-top"
          />
        </div>
      ))}
    </div>
  )
}
