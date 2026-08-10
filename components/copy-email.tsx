'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { EMAIL } from '@/content/contact'

export function CopyEmail() {
  const t = useTranslations('contact')
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard denied — the mailto link beside it still works.
    }
  }

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-4">
      <a href={`mailto:${EMAIL}`} className="break-all">
        {EMAIL}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 items-center text-sm tracking-wide uppercase"
      >
        {copied ? t('copied') : t('copyEmail')}
      </button>
      {/* Announce the result without stealing focus. */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t('copied') : ''}
      </span>
    </span>
  )
}
