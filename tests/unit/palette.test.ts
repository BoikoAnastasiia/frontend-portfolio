import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { contrastRatio, readPalette } from '@/lib/contrast'

const css = readFileSync('styles/globals.css', 'utf8')
const p = readPalette(css)

const AA = 4.5

describe('palette', () => {
  it('defines all five inks', () => {
    expect(Object.keys(p).sort()).toEqual([
      '--ink-cyan',
      '--ink-key',
      '--ink-magenta',
      '--ink-yellow',
      '--paper',
    ])
  })

  it('white on magenta passes AA', () => {
    expect(contrastRatio('white', p['--ink-magenta'])).toBeGreaterThanOrEqual(AA)
  })

  it('white on key passes AA', () => {
    expect(contrastRatio('white', p['--ink-key'])).toBeGreaterThanOrEqual(AA)
  })

  it('key on yellow passes AA', () => {
    expect(contrastRatio(p['--ink-key'], p['--ink-yellow'])).toBeGreaterThanOrEqual(AA)
  })

  it('key on cyan passes AA', () => {
    expect(contrastRatio(p['--ink-key'], p['--ink-cyan'])).toBeGreaterThanOrEqual(AA)
  })

  it('key on paper passes AA', () => {
    expect(contrastRatio(p['--ink-key'], p['--paper'])).toBeGreaterThanOrEqual(AA)
  })

  it('yellow underline on magenta clears the 3:1 non-text threshold', () => {
    expect(contrastRatio(p['--ink-yellow'], p['--ink-magenta'])).toBeGreaterThanOrEqual(3)
  })

  it('yellow on paper is prohibited and must stay unusable', () => {
    // Documents the rule rather than merely obeying it: if someone raises
    // yellow's lightness enough to "fix" this, the blog underline rotation
    // assumption breaks and this test tells them.
    expect(contrastRatio(p['--ink-yellow'], p['--paper'])).toBeLessThan(3)
  })
})
