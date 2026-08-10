import { describe, it, expect } from 'vitest'
import { contrastRatio } from '@/lib/contrast'

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
  })

  it('returns 1 for identical colours', () => {
    expect(contrastRatio('#ec008c', '#ec008c')).toBeCloseTo(1, 2)
  })

  it('is symmetric', () => {
    expect(contrastRatio('#ec008c', '#ffffff')).toBeCloseTo(
      contrastRatio('#ffffff', '#ec008c'),
      5,
    )
  })

  it('confirms true process magenta fails AA against white', () => {
    expect(contrastRatio('#ec008c', '#ffffff')).toBeLessThan(4.5)
  })

  it('confirms true process magenta fails AA against our key ink', () => {
    // Against *pure* #000 process magenta scrapes 4.95:1, but the site's key
    // ink is a soft black, and against that it drops to ~4.10:1. Pure black on
    // saturated magenta also vibrates badly, so darkening the ground and using
    // white text is the real fix.
    expect(contrastRatio('#ec008c', 'oklch(0.22 0 0)')).toBeLessThan(4.5)
  })

  it('parses oklch', () => {
    expect(contrastRatio('oklch(0.22 0 0)', 'oklch(0.985 0.002 106)')).toBeGreaterThan(14)
  })

  it('throws on an unparseable colour rather than silently passing', () => {
    expect(() => contrastRatio('not-a-colour', '#fff')).toThrow(/Unparseable/)
  })
})
