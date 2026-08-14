import { test, expect } from '@playwright/test'

const ROUTES = [
  { path: '/', page: 'home' },
  { path: '/projects', page: 'projects' },
  { path: '/about', page: 'about' },
  { path: '/blog', page: 'blog' },
  { path: '/contact', page: 'contact' },
]

for (const { path, page: id } of ROUTES) {
  test(`${path} loads the ${id} ink`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('html')).toHaveAttribute('data-page', id)
    await expect(page.locator('h1')).toBeVisible()
  })
}

for (const locale of ['uk', 'sk']) {
  test(`/${locale} declares lang="${locale}"`, async ({ page }) => {
    await page.goto(`/${locale}`)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
  })
}

test('the default locale stays unprefixed', async ({ page }) => {
  const res = await page.goto('/en')
  expect(new URL(page.url()).pathname).toBe('/')
  expect(res?.status()).toBeLessThan(400)
})

test('theme choice survives navigation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /monochrome|монохром|monochr/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'mono')
  await page.getByRole('navigation', { name: /main|головне|hlavné/i })
    .getByRole('link', { name: /about|про мене|o mne/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'mono')
})

test('the first block is never caught mid-fade at load', async ({ page }) => {
  await page.goto('/projects')
  // A view() timeline cannot tell that an element was already on screen, so
  // the top block opts out of the fade entirely. It must be readable at once.
  const top = page.locator('article').first()
  await expect(top).toBeVisible()
  await expect(top).toHaveCSS('opacity', '1')
})

test('a faded block resolves fully once scrolled to, in either engine', async ({ page }) => {
  await page.goto('/projects')
  const block = page.locator('[data-reveal-fade]').first()
  await block.evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await expect(block).toBeVisible()
  await expect(block).toHaveCSS('opacity', '1')
})

test('language switcher preserves the current path', async ({ page }) => {
  await page.goto('/projects')
  await page.getByRole('navigation', { name: /language|мова|jazyk/i })
    .getByRole('link', { name: 'SK' }).click()
  await expect(page).toHaveURL(/\/sk\/projects$/)
})

test('a project detail page carries its clips without fetching them upfront', async ({
  page,
}) => {
  const media: string[] = []
  page.on('request', (r) => {
    const u = r.url()
    if (u.includes('/media/')) media.push(u)
  })

  await page.goto('/projects/gipper')
  await expect(page.locator('html')).toHaveAttribute('data-page', 'projects')

  const clips = page.locator('video')
  await expect(clips).toHaveCount(2)
  // preload="none" plus no <source> until observed: the poster is the only
  // media request the page is allowed to make on arrival.
  await expect(clips.first()).toHaveAttribute('preload', 'none')
  expect(media.filter((u) => /\.(webm|mp4)$/.test(u))).toHaveLength(0)

  // The embed stays a button until asked.
  await expect(page.locator('iframe')).toHaveCount(0)
})

test('every project on the index links to its own page', async ({ page }) => {
  await page.goto('/projects')
  const links = page.locator('h2 a[href*="/projects/"]')
  await expect(links).toHaveCount(6)
})
