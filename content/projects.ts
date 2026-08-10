import type { TechId } from './tech'

export type Project = {
  /** Also the messages key: messages.projects.<slug> holds the description. */
  slug: string
  title: string
  tech: TechId[]
  liveUrl?: string
  repoUrl?: string
}

/**
 * Order is deliberate: strongest first, job-feed-bot last. It is the only entry
 * with no interface to show and is framed as a first-Python-project learning
 * story rather than a shipped product.
 */
export const PROJECTS: Project[] = [
  {
    slug: 'podhod',
    title: 'Подход',
    tech: ['react', 'typescript', 'hono', 'cloudflare-workers', 'drizzle'],
    liveUrl: 'https://podhod-workout.cc/',
    repoUrl: 'https://github.com/BoikoAnastasiia/podhod',
  },
  {
    slug: 'slovnicek',
    title: 'Slovníček',
    tech: ['next', 'typescript', 'dexie', 'supabase', 'pwa'],
    liveUrl: 'https://slovnicek-alpha.vercel.app/',
    repoUrl: 'https://github.com/BoikoAnastasiia/slovnicek',
  },
  {
    slug: 'rjecnicek',
    title: 'Rječniček',
    tech: ['next', 'typescript', 'dexie', 'supabase', 'vitest'],
    liveUrl: 'https://rjecnicek.vercel.app/',
    repoUrl: 'https://github.com/BoikoAnastasiia/rjecnicek',
  },
  {
    slug: 'guess-the-band',
    title: 'Guess the Band',
    tech: ['react', 'vite', 'typescript', 'supabase', 'motion'],
    liveUrl: 'https://guesstheband.fun/',
    repoUrl: 'https://github.com/BoikoAnastasiia/guess-the-band',
  },
  {
    slug: 'gipper',
    title: 'Gipper Platform',
    tech: ['react', 'typescript', 'mobx', 'module-federation', 'fabric', 'mui'],
    liveUrl: 'https://platform.gogipper.com/',
  },
  {
    slug: 'job-feed-bot',
    title: 'job-feed-bot',
    tech: ['python', 'github', 'telegram'],
    repoUrl: 'https://github.com/BoikoAnastasiia/jobfeeder',
  },
]

/** The three shown on the home page. */
export const FEATURED = PROJECTS.slice(0, 3)
