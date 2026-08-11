'use client'

import { useEffect, useRef, useState } from 'react'
import type { ProjectClip } from '@/content/projects'

/**
 * A recorded interaction.
 *
 * Nothing is fetched until the clip is close to the viewport: the <video> has
 * no children until then, so the browser has nothing to request. That keeps
 * six of these off the critical path.
 *
 * Autoplay is muted and inline, which is what iOS requires. Readers who ask
 * for reduced motion get the poster frame and a control instead — the clip is
 * still there, it just waits to be asked.
 */
export function ProjectClipPlayer({
  clip,
  caption,
}: {
  clip: ProjectClip
  caption: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [load, setLoad] = useState(false)
  const [calm, setCalm] = useState(false)

  useEffect(() => {
    setCalm(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setLoad(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Off screen: stop decoding frames nobody is looking at.
          if (ref.current && !ref.current.paused) ref.current.pause()
          return
        }
        setLoad(true)
      },
      { rootMargin: '200px 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  // play() rejects if the browser declines autoplay; the controls remain.
  useEffect(() => {
    if (!load || calm) return
    ref.current?.play().catch(() => {})
  }, [load, calm])

  return (
    <figure className={clip.shape === 'phone' ? 'mx-auto w-full max-w-[320px]' : ''}>
      <video
        ref={ref}
        poster={clip.poster}
        width={clip.width}
        height={clip.height}
        muted
        loop
        playsInline
        controls
        preload="none"
        aria-label={caption}
        className="w-full border"
        style={{ borderColor: 'var(--figure)', aspectRatio: `${clip.width} / ${clip.height}` }}
      >
        {load && (
          <>
            <source src={clip.webm} type="video/webm" />
            <source src={clip.mp4} type="video/mp4" />
          </>
        )}
      </video>
      <figcaption className="mt-3 text-[1.0625rem] leading-[1.4]">{caption}</figcaption>
    </figure>
  )
}
