'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { BandItem } from '@/content/projects'

/**
 * A clip inside the band. No controls and no chrome — at this size it reads as
 * a moving panel rather than a video player, so it behaves like one: silent,
 * looping, and only ever playing while it is on screen.
 */
function BandClip({ item, label }: { item: Extract<BandItem, { kind: 'clip' }>; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.querySelector('source')) {
            for (const [src, type] of [
              [item.webm, 'video/webm'],
              [item.mp4, 'video/mp4'],
            ]) {
              const s = document.createElement('source')
              s.src = src
              s.type = type
              el.appendChild(s)
            }
            el.load()
          }
          el.play().catch(() => {})
        } else if (!el.paused) {
          el.pause()
        }
      },
      { rootMargin: '150px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [item.webm, item.mp4])

  return (
    <video
      ref={ref}
      poster={item.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="h-full w-full object-cover object-top"
    />
  )
}

/**
 * The band that follows a project block: light and dark, desktop and phone,
 * and its clip, butted edge to edge with no gaps.
 *
 * Every panel is flexed in proportion to its own aspect ratio, so a phone
 * capture comes out as a narrow upright panel at roughly its real shape
 * instead of a zoomed-in crop the width of a laptop screen.
 */
export function ProjectStrip({ items, alt }: { items: BandItem[]; alt: string }) {
  if (items.length === 0) return null

  return (
    <div className="flex h-[clamp(11rem,30vw,26rem)] w-full">
      {items.map((item, i) => (
        <div
          key={item.kind === 'clip' ? item.webm : item.src}
          className="relative min-w-0 overflow-hidden"
          style={{ flex: `${item.aspect} 1 0%` }}
        >
          {item.kind === 'clip' ? (
            <BandClip item={item} label={alt} />
          ) : (
            <Image
              src={item.src}
              /* One description for the band; the panels share a subject. */
              alt={i === 0 ? alt : ''}
              fill
              sizes="(min-width: 768px) 34vw, 50vw"
              className="object-cover object-top"
            />
          )}
        </div>
      ))}
    </div>
  )
}
