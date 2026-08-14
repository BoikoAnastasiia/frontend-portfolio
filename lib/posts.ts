import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

const DIR = join(process.cwd(), 'content/posts')

/** Yellow is deliberately absent: it is invisible on the paper ground. */
export type PostInk = 'cyan' | 'magenta' | 'key'

export type PostMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
  ink: PostInk
  lang: 'en' | 'uk' | 'sk'
  /** Set on a post that is an outline rather than finished writing. */
  draft?: boolean
}

/**
 * Outlines are for writing against, not for reading. They stay visible while
 * the dev server is running and never reach the published site: the index, the
 * routes and the sitemap all enumerate posts through getAllPosts, so a draft
 * simply has no page in production and 404s if its URL is guessed.
 */
const SHOW_DRAFTS = process.env.NODE_ENV !== 'production'

export function inkVar(ink: PostInk): string {
  return `var(--ink-${ink})`
}

function read(slug: string) {
  const raw = readFileSync(join(DIR, `${slug}.mdx`), 'utf8')
  const { data, content } = matter(raw)
  return { meta: { slug, ...(data as Omit<PostMeta, 'slug'>) }, content }
}

export function getAllPosts(): PostMeta[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => read(f.replace(/\.mdx$/, '')).meta)
    .filter((post) => SHOW_DRAFTS || !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string) {
  return read(slug)
}
