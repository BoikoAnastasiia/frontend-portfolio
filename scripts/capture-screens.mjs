/**
 * Captures desktop and phone screens of the live projects.
 *
 * Run with `node scripts/capture-screens.mjs`. It is deliberately not part of
 * the build: these are real sites over the network, and a flaky capture must
 * never be able to fail a deploy.
 */
import { chromium, devices } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const TARGETS = [
  { slug: 'podhod', url: 'https://podhod-workout.cc/' },
  { slug: 'slovnicek', url: 'https://slovnicek-alpha.vercel.app/' },
  { slug: 'rjecnicek', url: 'https://rjecnicek.vercel.app/' },
  { slug: 'guess-the-band', url: 'https://guesstheband.fun/' },
]

const SHOTS = [
  { id: 'desktop', viewport: { width: 1440, height: 900 }, dsf: 2 },
  { id: 'mobile', viewport: { width: 390, height: 844 }, dsf: 3, mobile: true },
]

const browser = await chromium.launch()

for (const { slug, url } of TARGETS) {
  const dir = `public/media/${slug}`
  await mkdir(dir, { recursive: true })

  for (const shot of SHOTS) {
    const ctx = await browser.newContext({
      viewport: shot.viewport,
      deviceScaleFactor: shot.dsf,
      ...(shot.mobile ? devices['iPhone 13'] : {}),
      colorScheme: 'light',
      // A screenshot of an entrance animation mid-flight looks like a bug.
      reducedMotion: 'reduce',
    })
    const page = await ctx.newPage()
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1200)
      await page.screenshot({ path: `${dir}/${shot.id}.png` })
      console.log(`${slug} ${shot.id} ok`)
    } catch (err) {
      console.log(`${slug} ${shot.id} FAILED: ${err.message.split('\n')[0]}`)
    }
    await ctx.close()
  }
}

await browser.close()
