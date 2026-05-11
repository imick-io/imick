import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { ArticleCard } from "@/components/learn/article-card"
import { ClassCard } from "@/components/learn/class-card"
import { SnippetCard } from "@/components/learn/snippet-card"
import { siteConfig } from "@/lib/config"
import { getAllClassesForRender } from "@/lib/classes"
import { getAllPostsForRender } from "@/lib/posts"
import { getAllSnippetsForRender } from "@/lib/snippets"

const description = `Articles, code snippets, and classes by ${siteConfig.name}.`

export const metadata: Metadata = {
  title: "Learn",
  description,
  alternates: { canonical: "/learn" },
  openGraph: {
    type: "website",
    url: "/learn",
    siteName: siteConfig.handle,
    title: `Learn | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Learn | ${siteConfig.name}`,
    description,
  },
}

const HUB_LIMIT = 6

export default function LearnHubPage() {
  const posts = getAllPostsForRender().slice(0, HUB_LIMIT)
  const snippets = getAllSnippetsForRender().slice(0, HUB_LIMIT)
  const classes = getAllClassesForRender().slice(0, HUB_LIMIT)

  return (
    <div className="flex flex-col gap-16 px-6 py-16 md:gap-20 md:py-20">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Learn</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Writing, snippets, and classes
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          A growing library of articles, copy-pastable code, and structured courses.
        </p>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Latest Articles</h2>
          <Link
            href="/learn/articles"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
            First article coming soon.
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <ArticleCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Latest Snippets</h2>
          <Link
            href="/learn/snippets"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Link>
        </div>
        {snippets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
            First snippet coming soon.
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {snippets.map((snippet) => (
              <li key={snippet.slug}>
                <SnippetCard snippet={snippet} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Upcoming Classes</h2>
          <Link
            href="/learn/classes"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Link>
        </div>
        {classes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
            Structured courses on topics I write and ship -- sign up for the newsletter to
            hear when the first one drops.
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <li key={cls.slug}>
                <ClassCard cls={cls} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
