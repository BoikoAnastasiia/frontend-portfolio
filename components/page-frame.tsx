'use client'

import { useEffect } from 'react'

export type PageId = 'home' | 'projects' | 'about' | 'contact' | 'blog'

/**
 * Applies the page's ink to <html>.
 *
 * Two paths, both needed:
 *  - the inline script runs as the document streams, so the very first paint
 *    already has the right ground colour (no flash of paper white);
 *  - the effect covers client-side route changes, where the inline script is
 *    not re-executed.
 *
 * Setting the attribute twice is idempotent, so the overlap is harmless.
 */
export function PageFrame({
  page,
  children,
}: {
  page: PageId
  children: React.ReactNode
}) {
  useEffect(() => {
    document.documentElement.dataset.page = page
  }, [page])

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.dataset.page=${JSON.stringify(page)}`,
        }}
      />
      {children}
    </>
  )
}
