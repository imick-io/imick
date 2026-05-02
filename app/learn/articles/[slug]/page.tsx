import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allPosts } from "content-collections"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { MDXContent } from "@/components/mdx/mdx-content"
import { siteConfig } from "@/lib/config"
import { getPostBySlug, formatPostDate, categoryLabel, isDraft } from "@/lib/posts"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  const includeAll = process.env.NODE_ENV !== "production"
  return allPosts
    .filter((post) => includeAll || !isDraft(post))
    .map((post) => ({ slug: post.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  const url = `/learn/articles/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.handle,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function ArticlePage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="flex flex-col gap-8 px-6 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="mx-auto flex w-full max-w-3xl items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">
          Learn
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        <Link href="/learn/articles" className="hover:text-foreground">
          Articles
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        <span className="truncate text-foreground">{post.title}</span>
      </nav>

      <header className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {post.isDraft ? (
          <span className="self-start rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
            DRAFT
          </span>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{formatPostDate(post.publishedAt) || "Unscheduled"}</span>
          <span aria-hidden>·</span>
          <span>{categoryLabel[post.category]}</span>
          {post.tags.length > 0 ? (
            <>
              <span aria-hidden>·</span>
              <ul className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl text-base leading-relaxed text-foreground [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-muted-foreground hover:[&_a]:decoration-foreground [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:font-mono">
        <MDXContent code={post.code} />
      </div>
    </article>
  )
}
