import { describe, it, expect } from 'vitest'
import { getAllPosts, getPost, inkVar } from '@/lib/posts'

describe('posts', () => {
  it('publishes at least one post', () => {
    expect(getAllPosts().length).toBeGreaterThanOrEqual(1)
  })

  /* Deliberately not asserting "no drafts": under the test runner drafts are
     visible on purpose, exactly as they are against the dev server, so such a
     test would fail the moment a second article is started. Production
     behaviour is enforced by the filter in lib/posts.ts and checked against a
     real build, where a draft URL returns 404. */

  it('returns posts newest first', () => {
    const dates = getAllPosts().map((p) => p.date)
    expect([...dates].sort().reverse()).toEqual(dates)
  })

  it('gives every post a language tag', () => {
    for (const p of getAllPosts()) expect(['en', 'uk', 'sk']).toContain(p.lang)
  })

  it('never assigns yellow — it is invisible on paper', () => {
    for (const p of getAllPosts()) expect(['cyan', 'magenta', 'key']).toContain(p.ink)
  })

  it('maps ink names to palette variables', () => {
    expect(inkVar('cyan')).toBe('var(--ink-cyan)')
    expect(inkVar('magenta')).toBe('var(--ink-magenta)')
    expect(inkVar('key')).toBe('var(--ink-key)')
  })

  it('gives every post a title and an excerpt', () => {
    for (const p of getAllPosts()) {
      expect(p.title.length).toBeGreaterThan(0)
      expect(p.excerpt.length).toBeGreaterThan(0)
    }
  })

  it('reads a post body by slug', () => {
    const slug = getAllPosts()[0].slug
    expect(getPost(slug).content.length).toBeGreaterThan(0)
  })
})
