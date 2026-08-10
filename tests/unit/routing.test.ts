import { describe, it, expect } from 'vitest'
import { routing } from '@/i18n/routing'
import en from '@/messages/en.json'
import uk from '@/messages/uk.json'
import sk from '@/messages/sk.json'

describe('routing', () => {
  it('supports exactly en, uk and sk', () => {
    expect([...routing.locales]).toEqual(['en', 'uk', 'sk'])
  })

  it('defaults to English', () => {
    expect(routing.defaultLocale).toBe('en')
  })

  it('keeps the default locale unprefixed so the primary URL stays clean', () => {
    expect(routing.localePrefix).toBe('as-needed')
  })

  it('never auto-redirects on Accept-Language', () => {
    expect(routing.localeDetection).toBe(false)
  })
})

/** Recursively collect dotted key paths from a messages object. */
function keyPaths(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix]
  return Object.entries(obj).flatMap(([k, v]) =>
    keyPaths(v, prefix ? `${prefix}.${k}` : k),
  )
}

describe('messages', () => {
  const enKeys = keyPaths(en).sort()

  it.each([
    ['uk', uk],
    ['sk', sk],
  ])('%s has exactly the same keys as en', (_name, messages) => {
    expect(keyPaths(messages).sort()).toEqual(enKeys)
  })

  it.each([
    ['en', en],
    ['uk', uk],
    ['sk', sk],
  ])('%s has no empty strings', (_name, messages) => {
    const empties = keyPaths(messages).filter((path) => {
      const value = path
        .split('.')
        .reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], messages)
      return typeof value === 'string' && value.trim() === ''
    })
    expect(empties).toEqual([])
  })
})
