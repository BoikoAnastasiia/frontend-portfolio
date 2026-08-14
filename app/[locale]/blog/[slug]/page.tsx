import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import { PageFrame } from '@/components/page-frame'
import { ScrollProgress } from '@/components/scroll-progress'
import { Link } from '@/i18n/navigation'
import { getAllPosts, getPost, inkVar } from '@/lib/posts'
import { routing } from '@/i18n/routing'

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

        <article lang={post.lang} className="px-5 pt-24 pb-24 md:px-8 md:pt-40 md:pb-40">
          <hr className="rule" />
          <h1 className="poster pt-2 text-[clamp(2rem,7vw,5.5rem)] text-balance normal-case">
            {post.title}
          </h1>

          <p className="mt-6 flex flex-wrap items-center gap-3 text-sm tracking-wide uppercase">
            <time dateTime={post.date}>{post.date}</time>
            {post.draft && <span>{t('outline')}</span>}
          </p>

          <div className="prose mt-12 md:ml-[50%]">
            <MDXRemote
              source={content}
              options={{
                mdxOptions: {
                  rehypePlugins: [[rehypePrettyCode, { theme: 'github-light' }]],
                },
              }}
            />
          </div>

          <p className="mt-16 md:ml-[50%]">
            <Link href="/blog" className="font-bold">
              ← {t('back')}
            </Link>
          </p>
        </article>
      </div>
    </PageFrame>
  )
}
