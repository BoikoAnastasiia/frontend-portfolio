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
  /** A portrait recording is capped so it does not tower over the page. */
  shape?: 'phone'
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

/**
 * Both sizes and both themes of the same set of scenes. The first scene is
 * lifted out as the page's hero image, so the light desktop gallery skips it
 * rather than showing the same screen twice.
 */
const screens = (slug: string, scenes: string[]): ProjectMedia[] => [
  gallery(slug, 'desktop', scenes.slice(1)),
  gallery(slug, 'desktop', scenes, true),
  gallery(slug, 'mobile', scenes),
  gallery(slug, 'mobile', scenes, true),
]

/** One panel of the band under a project block. */
export type BandItem =
  | { kind: 'image'; src: string; aspect: number }
  | { kind: 'clip'; webm: string; mp4: string; poster: string; aspect: number }

const WIDE = 1440 / 900
const PHONE = 390 / 844

/**
 * The band under a project block: light and dark, desktop and phone, and a
 * clip if there is one. Each panel is flexed in proportion to its true aspect
 * ratio, so a phone comes out as a narrow upright panel rather than a laptop
 * screenshot's worth of zoomed-in interface.
 */
export function bandFor(project: Project): BandItem[] {
  if (project.band) return project.band

  const pick = (view: 'desktop' | 'mobile', dark: boolean, n = 0) => {
    const g = project.media?.find(
      (m) => m.kind === 'gallery' && m.view === view && m.id.endsWith('Dark') === dark,
    )
    return g && g.kind === 'gallery' ? g.items[n]?.src : undefined
  }

  const out: BandItem[] = []
  const add = (src: string | undefined, aspect: number) => {
    if (src) out.push({ kind: 'image', src, aspect })
  }

  add(project.hero, WIDE)
  add(pick('mobile', false, 1), PHONE)
  add(pick('desktop', true, 0), WIDE)
  add(pick('mobile', true, 2), PHONE)

  const clip = project.media?.find((m) => m.kind === 'clip')
  if (clip && clip.kind === 'clip') {
    out.push({
      kind: 'clip',
      webm: clip.webm,
      mp4: clip.mp4,
      poster: clip.poster,
      aspect: clip.width / clip.height,
    })
  }
  return out
}

export type Project = {
  /** Also the messages key: messages.projects.<slug> holds the description. */
  slug: string
  title: string
  tech: TechId[]
  liveUrl?: string
  repoUrl?: string
  /** Message key for the scope line. Absent where she was one of a team. */
  scope?: string
  /** The one screen that opens the page, full width. */
  hero?: string
  /** Explicit band panels, where the galleries are not the right source. */
  band?: BandItem[]
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
    scope: 'scopeFullstack',
    hero: '/media/guess-the-band/home-desktop.jpg',
    media: [
      ...screens('guess-the-band', ['home', 'quiz']),
      {
        kind: 'clip',
        id: 'phoneRound',
        webm: '/media/guess-the-band/quiz-phone.webm',
        mp4: '/media/guess-the-band/quiz-phone.mp4',
        poster: '/media/guess-the-band/quiz-phone.jpg',
        width: 620,
        height: 1342,
        shape: 'phone',
      },
    ],
  },
  {
    slug: 'podhod',
    /* The app's own wordmark is Latin, not Cyrillic. */
    title: 'Podhod',
    tech: ['react', 'typescript', 'hono', 'cloudflare-workers', 'drizzle'],
    liveUrl: 'https://podhod-workout.cc/',
    repoUrl: 'https://github.com/BoikoAnastasiia/podhod',
    scope: 'scopeFullstack',
    hero: '/media/podhod/home-desktop.jpg',
    media: [
      ...screens('podhod', ['home', 'programs', 'library', 'exercise', 'blog', 'article']),
      {
        kind: 'clip',
        id: 'programsPhone',
        webm: '/media/podhod/programs-phone.webm',
        mp4: '/media/podhod/programs-phone.mp4',
        poster: '/media/podhod/programs-phone.jpg',
        width: 620,
        height: 1342,
        shape: 'phone',
      },
    ],
  },
  {
    slug: 'slovnicek',
    title: 'Slovníček',
    tech: ['next', 'typescript', 'dexie', 'supabase', 'pwa'],
    liveUrl: 'https://slovnicek-alpha.vercel.app/',
    repoUrl: 'https://github.com/BoikoAnastasiia/slovnicek',
    scope: 'scopeFullstack',
    hero: '/media/slovnicek/home-desktop.jpg',
    media: [
      ...screens('slovnicek', ['home', 'round', 'words', 'profile']),
      {
        kind: 'clip',
        id: 'roundPhone',
        webm: '/media/slovnicek/round-phone.webm',
        mp4: '/media/slovnicek/round-phone.mp4',
        poster: '/media/slovnicek/round-phone.jpg',
        width: 620,
        height: 1342,
        shape: 'phone',
      },
    ],
  },
  {
    slug: 'rjecnicek',
    title: 'Rječniček',
    tech: ['next', 'typescript', 'dexie', 'supabase', 'vitest'],
    liveUrl: 'https://rjecnicek.vercel.app/',
    repoUrl: 'https://github.com/BoikoAnastasiia/rjecnicek',
    scope: 'scopeFullstack',
    hero: '/media/rjecnicek/home-desktop.jpg',
    media: [
      ...screens('rjecnicek', ['home', 'round', 'words', 'profile']),
      {
        kind: 'clip',
        id: 'roundPhone',
        webm: '/media/rjecnicek/round-phone.webm',
        mp4: '/media/rjecnicek/round-phone.mp4',
        poster: '/media/rjecnicek/round-phone.jpg',
        width: 620,
        height: 1342,
        shape: 'phone',
      },
    ],
  },
  {
    slug: 'gipper',
    title: 'Gipper Platform',
    tech: ['react', 'typescript', 'vite', 'mobx', 'module-federation', 'fabric', 'mui'],
    liveUrl: 'https://platform.gogipper.com/',
    band: [
      {
        kind: 'clip',
        webm: '/media/gipper/ai-image-generation.webm',
        mp4: '/media/gipper/ai-image-generation.mp4',
        poster: '/media/gipper/ai-image-generation.jpg',
        aspect: 1440 / 784,
      },
      {
        kind: 'clip',
        webm: '/media/gipper/autocreate-canvas.webm',
        mp4: '/media/gipper/autocreate-canvas.mp4',
        poster: '/media/gipper/autocreate-canvas.jpg',
        aspect: 1440 / 784,
      },
    ],
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
