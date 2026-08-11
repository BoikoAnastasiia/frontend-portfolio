/**
 * Captures the project screens used on /projects/<slug>.
 *
 * Run with `node scripts/capture-screens.mjs`. Deliberately not part of the
 * build: these are real sites over the network, and a flaky capture must never
 * be able to fail a deploy. Output lands in public/media/<slug>/ as PNG; run
 * scripts/optimise-screens.sh afterwards to size and convert them.
 *
 * A scene is one screen worth showing. `go` navigates to it from the app's
 * entry point — by URL where the app has real routes, by clicking where it
 * does not.
 */
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

// Match on the DOM's text, and only among visible nodes: several of these
// labels are uppercased by CSS, and some appear twice with one copy hidden.
const click = (pattern) => async (p) => {
  await p.locator(':visible').filter({ hasText: pattern }).last().click()
  await p.waitForTimeout(1400)
}

const path = (suffix) => async (p, base) => {
  await p.goto(base + suffix, { waitUntil: 'networkidle', timeout: 45_000 })
}

const TARGETS = [
  {
    slug: 'guess-the-band',
    base: 'https://guesstheband.fun',
    themes: ['light', 'dark'],
    scenes: [
      { id: 'home' },
      { id: 'quiz', go: click(/^Play random quiz$/i) },
    ],
  },
  {
    slug: 'podhod',
    base: 'https://podhod-workout.cc',
    themes: ['light', 'dark'],
    scenes: [
      { id: 'home' },
      { id: 'library', go: path('/library') },
      { id: 'exercise', go: path('/library/0025') },
      { id: 'blog', go: path('/blog') },
      { id: 'article', go: path('/blog/warm-up-and-stretch') },
    ],
  },
  {
    slug: 'slovnicek',
    base: 'https://slovnicek-alpha.vercel.app',
    themes: ['light', 'dark'],
    dark: click(/^Tmavý$/i),
    scenes: [
      { id: 'home' },
      { id: 'round', go: click(/^Začať kolo$/i) },
      { id: 'words', go: click(/^Slová$/) },
      { id: 'profile', go: click(/^Profil$/) },
    ],
  },
  {
    slug: 'rjecnicek',
    base: 'https://rjecnicek.vercel.app',
    themes: ['light', 'dark'],
    dark: click(/^Tamna$/i),
    scenes: [
      { id: 'home' },
      { id: 'round', go: click(/^Započni rundu$/i) },
      { id: 'words', go: click(/^Riječi$/) },
      { id: 'profile', go: click(/^Profil$/) },
    ],
  },
]

const VIEWS = [
  { id: 'desktop', viewport: { width: 1440, height: 900 }, dsf: 2 },
  { id: 'mobile', viewport: { width: 390, height: 844 }, dsf: 3 },
]

const browser = await chromium.launch()

for (const target of TARGETS) {
  const dir = `public/media/${target.slug}`
  await mkdir(dir, { recursive: true })

  for (const view of VIEWS) {
    for (const theme of target.themes) {
      for (const scene of target.scenes) {
        const ctx = await browser.newContext({
          viewport: view.viewport,
          deviceScaleFactor: view.dsf,
          colorScheme: theme,
          reducedMotion: 'reduce',
        })
        const page = await ctx.newPage()
        const name = `${scene.id}-${view.id}${theme === 'dark' ? '-dark' : ''}`
        try {
          await page.goto(target.base, { waitUntil: 'networkidle', timeout: 45_000 })

          // Apps whose theme lives in a setting rather than a media query.
          if (theme === 'dark' && target.dark) {
            await page.getByText(/^(Profil|Profile)$/).first().click()
            await page.waitForTimeout(600)
            await target.dark(page)
            await page.goBack().catch(() => {})
            await page.goto(target.base, { waitUntil: 'networkidle' })
          }

          if (scene.go) await scene.go(page, target.base)
          await page.evaluate(() => document.fonts.ready)
          await page.waitForTimeout(1200)
          await page.screenshot({ path: `${dir}/${name}.png` })
          console.log(`${target.slug} ${name} ok`)
        } catch (err) {
          console.log(`${target.slug} ${name} FAILED: ${err.message.split('\n')[0]}`)
        }
        await ctx.close()
      }
    }
  }
}

await browser.close()
