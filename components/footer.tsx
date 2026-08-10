import { ThemeToggle } from './theme-toggle'

export function Footer() {
  return (
    <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 px-5 pt-8 pb-8 md:mt-32 md:px-10">
      <small className="text-sm tracking-wide">
        © {new Date().getFullYear()} Anastasiia Boiko
      </small>
      <ThemeToggle />
    </footer>
  )
}
