import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { ArticleListRow } from "@/components/learn/article-list-row"
import { ClassBanner } from "@/components/learn/class-banner"
import { ClassCard } from "@/components/learn/class-card"
import { FeaturedArticle } from "@/components/learn/featured-article"
import { SnippetRow } from "@/components/learn/snippet-row"
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

const HUB_SNIPPET_LIMIT = 6

function SectionHeader({
  title,
  href,
  count,
  label,
}: {
  title: string
  href: string
  count: number
  label: string
}) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
      >
        All {label} ({count})
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
      </Link>
    </div>
  )
}

export default function LearnHubPage() {
  const allPosts = getAllPostsForRender()
  const allSnippets = getAllSnippetsForRender()
  const allClasses = getAllClassesForRender()

  const featuredPost = allPosts[0]
  const morePosts = allPosts.slice(1, 4)
  const snippets = allSnippets.slice(0, HUB_SNIPPET_LIMIT)
  const [firstClass, ...restClasses] = allClasses

  return (
    <div className="flex flex-col gap-16 px-6 py-16 md:gap-20 md:py-20">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Learn
        </p>
        <h1 className="font-heading text-4xl font-normal tracking-tight text-balance md:text-6xl">
          Things I write, build, and <em className="italic">teach</em>.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          Notes from real client work, code you can paste, and the occasional
          class.
        </p>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <SectionHeader
          title="Writing"
          href="/learn/articles"
          count={allPosts.length}
          label="articles"
        />
        {allPosts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
            First article coming soon.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <FeaturedArticle post={featuredPost} />
            {morePosts.length > 0 ? (
              <ul className="divide-y divide-border border-t border-border">
                {morePosts.map((post) => (
                  <li key={post.slug}>
                    <ArticleListRow post={post} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <SectionHeader
          title="Snippets"
          href="/learn/snippets"
          count={allSnippets.length}
          label="snippets"
        />
        {snippets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
            First snippet coming soon.
          </div>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {snippets.map((snippet) => (
              <li key={snippet.slug}>
                <SnippetRow snippet={snippet} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <SectionHeader
          title="Classes"
          href="/learn/classes"
          count={allClasses.length}
          label="classes"
        />
        {!firstClass ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
            Structured courses on topics I write and ship. Sign up for the
            newsletter to hear when the first one drops.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <ClassBanner cls={firstClass} />
            {restClasses.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2">
                {restClasses.map((cls) => (
                  <li key={cls.slug}>
                    <ClassCard cls={cls} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </section>

      <p className="mx-auto w-full max-w-5xl text-sm text-muted-foreground">
        Curious what tools all of this is built with?{" "}
        <Link
          href="/bookmarks"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Browse my bookmarks
        </Link>
        .
      </p>
    </div>
  )
}
