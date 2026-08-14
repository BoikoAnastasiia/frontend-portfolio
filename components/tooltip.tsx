'use client'

import { useId, useState, cloneElement, type ReactElement } from 'react'

type TriggerProps = {
  'aria-describedby'?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onFocus?: () => void
  onBlur?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}

/**
 * Deliberately hand-rolled rather than pulling in a library for one component.
 * Opens on hover *and* focus, so it is reachable by keyboard, and closes on
 * Escape.
 */
export function Tooltip({
  label,
  children,
  /** 'end' pins the bubble to the trigger's right edge, for triggers that sit
      hard against the side of the page and would otherwise clip. */
  align = 'center',
}: {
  label: string
  children: ReactElement<TriggerProps>
  align?: 'center' | 'end'
}) {
  const id = useId()
  const [open, setOpen] = useState(false)

  const trigger = cloneElement(children, {
    'aria-describedby': open ? id : undefined,
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    },
  })

  return (
    <span className="relative inline-flex">
      {trigger}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={`pointer-events-none absolute bottom-full z-20 mb-1 border px-2 py-1 text-xs tracking-wide whitespace-nowrap uppercase ${
            align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
          }`}
          style={{
            background: 'var(--ground)',
            color: 'var(--figure)',
            borderColor: 'var(--figure)',
          }}
        >
          {label}
        </span>
      )}
    </span>
  )
}
