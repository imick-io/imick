import type { Metadata } from "next"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { RssIcon } from "@hugeicons/core-free-icons"
import { ArticlesGrid } from "@/components/learn/articles-grid"
import { CategoryPills, isValidCategory } from "@/components/learn/category-pills"
import { FeaturedArticle } from "@/components/learn/featured-article"
import { siteConfig } from "@/lib/config"
import { getAllPostsForRender } from "@/lib/posts"

const description = `Articles by ${siteConfig.name} — opinions and technical deep-dives.`

export const metadata: Metadata = {
  title: "Articles",
  description,
  alternates: {
    canonical: "/learn/articles",
    types: { "application/rss+xml": "/learn/articles/feed.xml" },
  },
  openGraph: {
    type: "website",
    url: "/learn/articles",
    siteName: siteConfig.handle,
    title: `Articles | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Articles | ${siteConfig.name}`,
    description,
  },
}

type SearchParams = Promise<{ category?: string }>

export default async function ArticlesIndexPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { category } = await searchParams
  const active = isValidCategory(category) ? category : undefined
  const all = getAllPostsForRender()
  const filtered = active ? all.filter((p) => p.category === active) : all
  const featured = !active ? filtered[0] : undefined
  const gridPosts = featured ? filtered.slice(1) : filtered

  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-20">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <Breadcrumb items={[{ label: "Learn", href: "/learn" }, { label: "Articles" }]} />
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-heading text-4xl font-normal tracking-tight md:text-5xl">
            Articles
          </h1>
          <Link
            href="/learn/articles/feed.xml"
            aria-label="RSS feed for articles"
            className="text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={RssIcon} size={20} />
          </Link>
        </div>
        <p className="text-base text-muted-foreground md:text-lg">
          Opinions, technical write-ups, and notes from the work.
        </p>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {all.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
            <p className="text-base font-medium text-foreground">First article coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The first post is being written. Check back shortly.
            </p>
          </div>
        ) : (
          <>
            <CategoryPills active={active} />
            {featured ? <FeaturedArticle post={featured} /> : null}
            {gridPosts.length > 0 ? (
              <ArticlesGrid key={active ?? "all"} posts={gridPosts} />
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}
