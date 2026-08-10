import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Locale-aware navigation. Always import Link from here, never from next/link,
 * or the locale prefix is dropped on internal navigation.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
