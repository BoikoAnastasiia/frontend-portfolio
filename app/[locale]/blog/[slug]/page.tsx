import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import { PageFrame } from '@/components/page-frame'
import { ScrollProgress } from '@/components/scroll-progress'
import { GipperAiLoader } from '@/components/gipper-ai-loader'
import { Link } from '@/i18n/navigation'
import { getAllPosts, getPost, inkVar } from '@/lib/posts'
import { routing, type Locale } from '@/i18n/routing'
import { pageMetadata } from '@/lib/page-metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getAllPosts().find((p) => p.slug === slug)
  if (!post) return {}
  return pageMetadata({
    locale: locale as Locale,
    path: `/blog/${slug}`,
    title: post.title,
    description: post.excerpt,
  })
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllPosts().map((post) => ({ locale, slug: post.slug })),
  )
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const post = getAllPosts().find((p) => p.slug === slug)
  if (!post) notFound()

  const { content } = getPost(slug)
  const t = await getTranslations('blog')

  return (
    <PageFrame page="blog">
      <div style={{ ['--post-ink' as string]: inkVar(post.ink) }}>
        <ScrollProgress />

        {/* A reading column, not the site's poster grid: pushing 3,000 characters
            into the right half leaves the left one empty for the whole article.
            Symmetric margins read as a measure; one dead column reads as a bug. */}
        <article
          lang={post.lang}
          className="mx-auto max-w-[58rem] px-5 pt-24 pb-24 md:px-8 md:pt-40 md:pb-40"
        >
          <hr className="rule" />
          <h1 className="poster pt-2 text-[clamp(2rem,7vw,5.5rem)] text-balance normal-case">
            {post.title}
          </h1>

          <p className="mt-6 flex flex-wrap items-center gap-3 text-sm tracking-wide uppercase">
            <time dateTime={post.date}>{post.date}</time>
            {post.draft && <span>{t('outline')}</span>}
          </p>

          <div className="prose mt-12">
            <MDXRemote
              source={content}
              /* Components a post may use by name in its MDX. */
              components={{ GipperAiLoader }}
              options={{
                mdxOptions: {
                  /* github-light renders some tokens at #E36209, which is 3.48:1 on
                     white and fails AA. The high-contrast variant is built for this. */
                  rehypePlugins: [
                    [rehypePrettyCode, { theme: 'github-light-high-contrast' }],
                  ],
                },
              }}
            />
          </div>

          <p className="mt-16">
            <Link href="/blog" className="font-bold">
              ← {t('back')}
            </Link>
          </p>
        </article>
      </div>
    </PageFrame>
  )
}
