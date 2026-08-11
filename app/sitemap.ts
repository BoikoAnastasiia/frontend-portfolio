import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getAllPosts } from '@/lib/posts'
import { PROJECTS } from '@/content/projects'
import { SITE_URL } from '@/lib/site'

const ROUTES = [
  '',
  '/projects',
  '/about',
  '/blog',
  '/contact',
  ...PROJECTS.map((p) => `/projects/${p.slug}`),
]

export default function sitemap(): MetadataRoute.Sitemap {
  const prefix = (locale: string) => (locale === routing.defaultLocale ? '' : `/${locale}`)

  const pages = routing.locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${SITE_URL}${prefix(locale)}${route}`,
      lastModified: new Date('2026-08-10'),
    })),
  )

  const posts = routing.locales.flatMap((locale) =>
    getAllPosts().map((post) => ({
      url: `${SITE_URL}${prefix(locale)}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  )

  return [...pages, ...posts]
}
