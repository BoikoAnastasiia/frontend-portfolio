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

test('reveal targets are visible regardless of engine support', async ({ page }) => {
  await page.goto('/projects')
  const card = page.locator('[data-reveal]').first()
  await expect(card).toBeVisible()
  await expect(card).toHaveCSS('opacity', '1')
})

test('language switcher preserves the current path', async ({ page }) => {
  await page.goto('/projects')
  await page.getByRole('navigation', { name: /language|мова|jazyk/i })
    .getByRole('link', { name: 'SK' }).click()
  await expect(page).toHaveURL(/\/sk\/projects$/)
})
