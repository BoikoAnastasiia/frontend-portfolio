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

/**
 * Several screens of one app at one size, captured by
 * scripts/capture-screens.mjs. A landing page alone says nothing about how an
 * app behaves; the interesting screens are the ones behind it.
 */
export type ProjectGallery = {
  kind: 'gallery'
  /** Caption key: messages.projects.<id>. */
  id: 'desktop' | 'desktopDark' | 'phone' | 'phoneDark'
  view: 'desktop' | 'mobile'
  /** Each scene id doubles as its label key: messages.projects.scene.<id>. */
  items: { src: string; scene: string }[]
}

export type ProjectMedia = ProjectClip | ProjectEmbed | ProjectGallery

const gallery = (
  slug: string,
  view: 'desktop' | 'mobile',
  scenes: string[],
  dark = false,
): ProjectGallery => ({
  kind: 'gallery',
  id: view === 'mobile' ? (dark ? 'phoneDark' : 'phone') : dark ? 'desktopDark' : 'desktop',
  view,
  items: scenes.map((scene) => ({
    scene,
    src: `/media/${slug}/${scene}-${view}${dark ? '-dark' : ''}.jpg`,
  })),
})

/** Both sizes and both themes of the same set of scenes. */
const screens = (slug: string, scenes: string[]): ProjectMedia[] => [
  gallery(slug, 'desktop', scenes),
  gallery(slug, 'desktop', scenes, true),
  gallery(slug, 'mobile', scenes),
  gallery(slug, 'mobile', scenes, true),
]

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
 * Order is deliberate: Guess the Band leads because its interface carries the
 * most design work, and job-feed-bot sits last as the only entry with no
 * interface to show.
 */
export const PROJECTS: Project[] = [
  {
    slug: 'guess-the-band',
    title: 'Guess the Band',
    tech: ['react', 'vite', 'typescript', 'supabase', 'motion'],
    liveUrl: 'https://guesstheband.fun/',
    repoUrl: 'https://github.com/BoikoAnastasiia/guess-the-band',
    media: screens('guess-the-band', ['home', 'quiz']),
  },
  {
    slug: 'podhod',
    /* The app's own wordmark is Latin, not Cyrillic. */
    title: 'Podhod',
    tech: ['react', 'typescript', 'hono', 'cloudflare-workers', 'drizzle'],
    liveUrl: 'https://podhod-workout.cc/',
    repoUrl: 'https://github.com/BoikoAnastasiia/podhod',
    media: screens('podhod', ['home', 'library', 'exercise', 'blog', 'article']),
  },
  {
    slug: 'slovnicek',
    title: 'Slovníček',
    tech: ['next', 'typescript', 'dexie', 'supabase', 'pwa'],
    liveUrl: 'https://slovnicek-alpha.vercel.app/',
    repoUrl: 'https://github.com/BoikoAnastasiia/slovnicek',
    media: screens('slovnicek', ['home', 'round', 'words', 'profile']),
  },
  {
    slug: 'rjecnicek',
    title: 'Rječniček',
    tech: ['next', 'typescript', 'dexie', 'supabase', 'vitest'],
    liveUrl: 'https://rjecnicek.vercel.app/',
    repoUrl: 'https://github.com/BoikoAnastasiia/rjecnicek',
    media: screens('rjecnicek', ['home', 'round', 'words', 'profile']),
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
