import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import messages from '@/messages/en.json'
import { ThemeToggle } from '@/components/theme-toggle'

function setup() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeToggle />
    </NextIntlClientProvider>,
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.dataset.theme = 'color'
  })

  it('starts unpressed in colour mode', () => {
    setup()
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches the document to mono and persists it', async () => {
    setup()
    await userEvent.click(screen.getByRole('button'))
    expect(document.documentElement.dataset.theme).toBe('mono')
    expect(localStorage.getItem('theme')).toBe('mono')
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches back to colour', async () => {
    setup()
    const button = screen.getByRole('button')
    await userEvent.click(button)
    await userEvent.click(button)
    expect(document.documentElement.dataset.theme).toBe('color')
    expect(localStorage.getItem('theme')).toBe('color')
  })

  it('adopts a mono theme already applied by the inline script', () => {
    document.documentElement.dataset.theme = 'mono'
    setup()
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('is operable by keyboard', async () => {
    setup()
    await userEvent.tab()
    expect(screen.getByRole('button')).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(document.documentElement.dataset.theme).toBe('mono')
  })

  it('survives localStorage being unavailable', async () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage')!
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('denied')
      },
    })
    try {
      setup()
      await userEvent.click(screen.getByRole('button'))
      expect(document.documentElement.dataset.theme).toBe('mono')
    } finally {
      Object.defineProperty(window, 'localStorage', original)
    }
  })
})
