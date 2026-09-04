import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/**
 * The CV lives in Google Drive so it can be updated without a deploy. Replace
 * it in place — File information → Manage versions → Upload new version — or
 * the id changes and this URL goes stale.
 *
 * The whole site links to /cv, never to Drive, so this is the only line that
 * has to change if the file, or the host, ever moves.
 */
const CV_URL =
  'https://drive.google.com/file/d/1UzcRz1kLJ8r3BUqU6nEymsdFPis0xksr/view?usp=sharing'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  /* Redirects run before the proxy, so /cv never reaches next-intl's locale
     handling and never needs a page of its own. Temporary, not permanent: a
     308 would be cached by browsers long after the destination changed. */
  async redirects() {
    return [
      { source: '/cv', destination: CV_URL, permanent: false },
      /* The address that was on earlier applications and LinkedIn. */
      { source: '/cv.pdf', destination: '/cv', permanent: false },
    ]
  },
}

export default withNextIntl(nextConfig)
