import type { IconId } from '@/components/tech-icons.generated'

/**
 * Every technology a project card can list. `icon` is optional: an entry
 * without one renders as a typographic chip, so a missing drawing never
 * blocks a project from listing its stack.
 */
export type Tech = {
  name: string
  icon?: IconId
  /** Wordmarks need less height than glyphs to look the same weight. */
  kind?: 'glyph' | 'wordmark'
  /** Official brand colour, revealed on hover only. */
  brand?: string
}

export const TECH = {
  react: { name: 'React', icon: 'react', kind: 'glyph', brand: '#61DAFB' },
  next: { name: 'Next.js', icon: 'next', kind: 'wordmark', brand: '#000000' },
  typescript: { name: 'TypeScript', icon: 'typescript', kind: 'glyph', brand: '#3178C6' },
  vite: { name: 'Vite', icon: 'vite', kind: 'glyph', brand: '#9135FF' },
  vitest: { name: 'Vitest', icon: 'vitest', kind: 'wordmark', brand: '#00FF74' },
  motion: { name: 'Motion', icon: 'motion', kind: 'wordmark', brand: '#0055FF' },
  mobx: { name: 'MobX', icon: 'mobx', kind: 'glyph', brand: '#FF9955' },
  mui: { name: 'MUI', icon: 'mui', kind: 'glyph', brand: '#007FFF' },
  'module-federation': {
    name: 'Module Federation',
    icon: 'module-federation', kind: 'glyph',
    brand: '#8DD6F9',
  },
  /* No icon on purpose: the drawn mark is a hairline pair of scissors on a
     657x477 canvas, and at chip height its ribbons come out under a pixel wide
     — barely visible on paper and invisible on hover, where the brand pink is
     lighter still. It falls back to the typographic chip, as Hono does.
     Restore `icon: 'fabric'` once the mark is redrawn with real stroke weight. */
  fabric: { name: 'Fabric.js', brand: '#FF5A5F' },
  'cloudflare-workers': {
    name: 'Cloudflare Workers',
    icon: 'cloudflare-workers', kind: 'glyph',
    brand: '#F38020',
  },
  drizzle: { name: 'Drizzle ORM', icon: 'drizzle', kind: 'glyph', brand: '#C5F74F' },
  dexie: { name: 'Dexie', icon: 'dexie', kind: 'wordmark', brand: '#EF5E4E' },
  supabase: { name: 'Supabase', icon: 'supabase', kind: 'glyph', brand: '#3FCF8E' },
  pwa: { name: 'PWA', icon: 'pwa', kind: 'wordmark', brand: '#5A0FC8' },
  python: { name: 'Python', icon: 'python', kind: 'glyph', brand: '#3776AB' },
  github: { name: 'GitHub Actions', icon: 'github', kind: 'glyph', brand: '#2088FF' },
  telegram: { name: 'Telegram Bot', icon: 'telegram', kind: 'glyph', brand: '#26A5E4' },
  // No drawing yet — renders as a typographic chip.
  hono: { name: 'Hono', brand: '#E36002' },
} as const satisfies Record<string, Tech>

export type TechId = keyof typeof TECH
