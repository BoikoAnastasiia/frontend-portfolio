import Image from 'next/image'
import type { ProjectShots } from '@/content/projects'

/**
 * Desktop and phone in one frame: the wide screen sets the scale, the phone
 * overlaps its lower-right corner the way a printed case study lays them out.
 * Below the md breakpoint they simply stack — an overlapping phone on a phone
 * is a joke nobody can read.
 */
export function ProjectScreens({
  shots,
  caption,
  title,
}: {
  shots: ProjectShots
  caption: string
  title: string
}) {
  return (
    <figure className="mt-10">
      <div className="md:relative md:pb-16">
        <Image
          src={shots.desktop}
          alt={`${title} — ${caption}`}
          width={1600}
          height={1000}
          sizes="(min-width: 768px) 80vw, 100vw"
          className="w-full border"
          style={{ borderColor: 'var(--figure)' }}
        />
        <Image
          src={shots.mobile}
          alt=""
          width={780}
          height={1688}
          sizes="(min-width: 768px) 20vw, 50vw"
          className="mt-5 w-1/2 border md:absolute md:right-6 md:bottom-0 md:mt-0 md:w-[19%]"
          style={{ borderColor: 'var(--figure)' }}
        />
      </div>
      <figcaption className="mt-3 text-[1.0625rem] leading-[1.4]">{caption}</figcaption>
    </figure>
  )
}
