'use client'

import { useState } from 'react'
import type { ProjectEmbed } from '@/content/projects'

/**
 * A live site inside the page — but only after the reader asks. An iframe
 * boots the whole embedded application, so loading several on arrival would
 * cost more than every other asset on this site combined.
 */
export function ProjectEmbedFrame({
  embed,
  caption,
  openLabel,
}: {
  embed: ProjectEmbed
  caption: string
  openLabel: string
}) {
  const [live, setLive] = useState(false)
  const phone = embed.shape === 'phone'

  return (
    <figure className="mt-10">
      <div
        className={`relative border ${phone ? 'mx-auto max-w-[390px]' : ''}`}
        style={{
          borderColor: 'var(--figure)',
          aspectRatio: phone ? '390 / 780' : '16 / 10',
        }}
      >
        {live ? (
          <iframe
            src={embed.url}
            title={caption}
            loading="lazy"
            // The embedded site is not ours to trust with the parent page.
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLive(true)}
            className="absolute inset-0 flex items-center justify-center p-6 text-center font-bold underline"
          >
            {openLabel}
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-[1.0625rem] leading-[1.4]">{caption}</figcaption>
    </figure>
  )
}
