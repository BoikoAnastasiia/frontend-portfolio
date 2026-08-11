import type { TechId } from './tech'

/**
 * A recorded interaction. Both encodings are shipped: Safari only gained VP9
 * in WebM recently and older iOS still needs the H.264 MP4.
 */
export type ProjectClip = {
  kind: 'clip'
  /** Also the caption key: messages.projects.<slug>.media.<id>. */
  id: string
  webm: string
  mp4: string
  poster: string
  width: number
  height: number
}

/** A live site loaded into the page, but only once the reader asks for it. */
export type ProjectEmbed = {
  kind: 'embed'
  id: string
  url: string
  /** Phone-shaped or landscape; decides the frame it sits in. */
  shape: 'phone' | 'wide'
}

/** The same screen at both sizes, captured by scripts/capture-screens.mjs. */
export type ProjectShots = {
  kind: 'shots'
  /** Caption key: messages.projects.<id>. */
  id: 'screens' | 'screensDark'
  desktop: string
  mobile: string
}

export type ProjectMedia = ProjectClip | ProjectEmbed | ProjectShots

/** Every project shot is captured at the same two viewports. */
const shots = (slug: string, dark = false): ProjectShots => ({
  kind: 'shots',
  id: dark ? 'screensDark' : 'screens',
  desktop: `/media/${slug}/desktop${dark ? '-dark' : ''}.jpg`,
  mobile: `/media/${slug}/mobile${dark ? '-dark' : ''}.jpg`,
})

export type Project = {
  /** Also the messages key: messages.projects.<slug> holds the description. */
  slug: string
  title: string
  tech: TechId[]
  liveUrl?: string
  repoUrl?: string
  media?: ProjectMedia[]
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
    media: [shots('podhod'), shots('podhod', true)],
  },
  {
    slug: 'slovnicek',
    title: 'Slovníček',
    tech: ['next', 'typescript', 'dexie', 'supabase', 'pwa'],
    liveUrl: 'https://slovnicek-alpha.vercel.app/',
    repoUrl: 'https://github.com/BoikoAnastasiia/slovnicek',
    media: [shots('slovnicek'), shots('slovnicek', true)],
  },
  {
    slug: 'rjecnicek',
    title: 'Rječniček',
    tech: ['next', 'typescript', 'dexie', 'supabase', 'vitest'],
    liveUrl: 'https://rjecnicek.vercel.app/',
    repoUrl: 'https://github.com/BoikoAnastasiia/rjecnicek',
    media: [shots('rjecnicek'), shots('rjecnicek', true)],
  },
  {
    slug: 'guess-the-band',
    title: 'Guess the Band',
    tech: ['react', 'vite', 'typescript', 'supabase', 'motion'],
    liveUrl: 'https://guesstheband.fun/',
    repoUrl: 'https://github.com/BoikoAnastasiia/guess-the-band',
    media: [shots('guess-the-band'), shots('guess-the-band', true)],
  },
  {
    slug: 'gipper',
    title: 'Gipper Platform',
    tech: ['react', 'typescript', 'vite', 'mobx', 'module-federation', 'fabric', 'mui'],
    liveUrl: 'https://platform.gogipper.com/',
    media: [
      {
        kind: 'clip',
        id: 'imageGeneration',
        webm: '/media/gipper/ai-image-generation.webm',
        mp4: '/media/gipper/ai-image-generation.mp4',
        poster: '/media/gipper/ai-image-generation.jpg',
        width: 1440,
        height: 784,
      },
      {
        kind: 'clip',
        id: 'autoCreate',
        webm: '/media/gipper/autocreate-canvas.webm',
        mp4: '/media/gipper/autocreate-canvas.mp4',
        poster: '/media/gipper/autocreate-canvas.jpg',
        width: 1440,
        height: 784,
      },
      {
        kind: 'embed',
        id: 'storybook',
        url: 'https://epic-storybook.d36696kjei9opm.amplifyapp.com/?path=/docs/components-modals-tablelayoutmodal--docs',
        shape: 'wide',
      },
    ],
  },
  {
    slug: 'job-feed-bot',
    title: 'job-feed-bot',
    tech: ['python', 'github', 'telegram'],
    repoUrl: 'https://github.com/BoikoAnastasiia/jobfeeder',
  },
]
