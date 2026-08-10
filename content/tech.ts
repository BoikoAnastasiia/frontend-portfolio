import type { IconId } from '@/components/tech-icons.generated'

/**
 * Every technology a project card can list. `icon` is optional: an entry
 * without one renders as a typographic chip, so a missing drawing never
 * blocks a project from listing its stack.
 */
export type Tech = {
  name: string
  icon?: IconId
  /** Official brand colour, revealed on hover only. */
  brand?: string
}

export const TECH = {
  react: { name: 'React', icon: 'react', brand: '#61DAFB' },
  next: { name: 'Next.js', icon: 'next', brand: '#000000' },
  typescript: { name: 'TypeScript', icon: 'typescript', brand: '#3178C6' },
  vite: { name: 'Vite', icon: 'vite', brand: '#9135FF' },
  vitest: { name: 'Vitest', icon: 'vitest', brand: '#00FF74' },
  motion: { name: 'Motion', icon: 'motion', brand: '#0055FF' },
  mobx: { name: 'MobX', icon: 'mobx', brand: '#FF9955' },
  mui: { name: 'MUI', icon: 'mui', brand: '#007FFF' },
  'module-federation': {
    name: 'Module Federation',
    icon: 'module-federation',
    brand: '#8DD6F9',
  },
  fabric: { name: 'Fabric.js', icon: 'fabric', brand: '#FF5A5F' },
  'cloudflare-workers': {
    name: 'Cloudflare Workers',
    icon: 'cloudflare-workers',
    brand: '#F38020',
  },
  drizzle: { name: 'Drizzle ORM', icon: 'drizzle', brand: '#C5F74F' },
  dexie: { name: 'Dexie', icon: 'dexie', brand: '#EF5E4E' },
  supabase: { name: 'Supabase', icon: 'supabase', brand: '#3FCF8E' },
  pwa: { name: 'PWA', icon: 'pwa', brand: '#5A0FC8' },
  python: { name: 'Python', icon: 'python', brand: '#3776AB' },
  github: { name: 'GitHub Actions', icon: 'github', brand: '#2088FF' },
  telegram: { name: 'Telegram Bot', icon: 'telegram', brand: '#26A5E4' },
  // No drawing yet — renders as a typographic chip.
  hono: { name: 'Hono', brand: '#E36002' },
} as const satisfies Record<string, Tech>

export type TechId = keyof typeof TECH
