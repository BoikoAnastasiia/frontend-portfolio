import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageFrame } from '@/components/page-frame'
import { PageTitle } from '@/components/page-title'
import { Link } from '@/i18n/navigation'
import { getAllPosts, inkVar } from '@/lib/posts'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const posts = getAllPosts()

  return (
    <PageFrame page="blog">
      <PageTitle>{t('title')}</PageTitle>

      <section className="px-5 pt-16 pb-24 md:px-8 md:pt-24 md:pb-40">
        <p className="measure mb-12 text-[clamp(1.0625rem,1rem+0.4vw,1.25rem)] md:mb-16 md:ml-[50%]">
          {t('lede')}
        </p>

        <ul className="flex flex-col">
          {posts.map((post) => (
            <li key={post.slug} className="border-t first:border-t-0">
              <Link
                href={`/blog/${post.slug}`}
                className="grid gap-3 py-8 no-underline md:grid-cols-2 md:gap-10 md:py-10"
                style={{ ['--post-ink' as string]: inkVar(post.ink) }}
              >
                <h2 className="text-[clamp(1.5rem,1rem+2vw,2.5rem)] leading-[1.05] font-bold tracking-[-0.02em] text-balance underline decoration-[var(--post-ink)] decoration-[0.1em] underline-offset-[0.16em]">
                  {post.title}
                </h2>

                <div>
                  <p className="text-[clamp(1.0625rem,1rem+0.4vw,1.25rem)] leading-[1.4] text-pretty">
                    {post.excerpt}
                  </p>
                  <p className="mt-3 flex flex-wrap items-center gap-3 text-sm tracking-wide uppercase">
                    <time dateTime={post.date}>{post.date}</time>
                    {/* A real lang attribute: screen readers switch voice on it. */}
                    <span
                      lang={post.lang}
                      className="border px-1.5 py-0.5"
                      style={{ borderColor: 'var(--post-ink)' }}
                    >
                      {post.lang}
                    </span>
                    {post.draft && <span>{t('outline')}</span>}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageFrame>
  )
}
