'use client'

import { Link, usePathname } from '@/i18n/navigation'

export type NavItem = { href: string; key: string; label: string }

/**
 * The main nav, with the section you are in marked.
 *
 * Labels arrive already translated so this stays a thin client component: the
 * only thing it needs the browser for is the current path.
 *
 * Which link is current is expressed only through aria-current, with the
 * styling hung off that in CSS. A className computed from the pathname is what
 * React reports a hydration mismatch on — the same trap the language switcher
 * hit, and it is solved here the same way.
 */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <ul className="flex flex-wrap items-baseline gap-x-6 md:justify-between md:pr-6">
      {items.map((item) => {
        /* A post or a project still counts as its section: /blog/some-note
           keeps BLOG marked. Home is the exception — as "/" it is a prefix of
           every path, so it only ever matches exactly. */
        const current =
          item.href === '/'
            ? pathname === '/'
            : pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={current ? 'page' : undefined}
              className="nav-link inline-flex min-h-11 items-center text-sm font-bold tracking-[-0.01em] uppercase md:text-base"
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
