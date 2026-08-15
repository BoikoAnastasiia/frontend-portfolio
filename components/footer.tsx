import { ThemeToggle } from './theme-toggle'
import { CONTACT_LINKS } from '@/content/contact'

/**
 * The profile links live here as well as on the contact page: a reader who
 * arrives on a post or a project page would otherwise have to navigate back
 * through the nav to find them. The CV is deliberately left out — it belongs
 * on the pages that argue for it, not under every article.
 */
const FOOTER_LINKS = CONTACT_LINKS.filter((l) => l.key !== 'cv')

export function Footer() {
  return (
    <footer className="mt-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 pt-8 pb-8 md:mt-32 md:px-10">
      <small className="text-sm tracking-wide">
        © {new Date().getFullYear()} Anastasiia Boiko
      </small>

      <nav className="flex flex-wrap items-center gap-x-5">
        {FOOTER_LINKS.map((link) => (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener me"
            className="inline-flex min-h-11 items-center text-sm tracking-wide uppercase no-underline hover:underline"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <ThemeToggle />
    </footer>
  )
}
