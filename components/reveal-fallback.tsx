'use client'

import { useEffect } from 'react'

const SUPPORTS = '(animation-timeline: view()) and (animation-range: entry)'

/**
 * Firefox has no scroll-driven animations, so this supplies the same motion
 * with an IntersectionObserver. Elements start visible; the observer only ever
 * opts them into an animated entrance, so if this never runs nothing is hidden.
 */
export function RevealFallback() {
  useEffect(() => {
    if (typeof CSS === 'undefined' || CSS.supports(SUPPORTS)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    targets.forEach((el) => {
      el.dataset.revealed = 'false'
    })

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.revealed = 'true'
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    targets.forEach((el) => io.observe(el))

    const bar = document.querySelector<HTMLElement>('[data-scroll-progress]')
    let frame = 0
    function onScroll() {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (!bar) return
        const max = document.documentElement.scrollHeight - window.innerHeight
        bar.style.setProperty('--progress', String(max > 0 ? window.scrollY / max : 0))
      })
    }
    if (bar) {
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    }

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
