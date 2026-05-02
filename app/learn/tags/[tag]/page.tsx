import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allPosts, allSnippets } from "content-collections"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { ArticlesGrid } from "@/components/learn/articles-grid"
import { SnippetsGrid } from "@/components/learn/snippets-grid"
import { siteConfig } from "@/lib/config"
import { getAllPostsForRender, isDraft } from "@/lib/posts"
import { getAllSnippetsForRender, isSnippetDraft } from "@/lib/snippets"

type Params = { tag: string }

export function generateStaticParams(): Params[] {
  const includeAll = process.env.NODE_ENV !== "production"
  const postTags = allPosts
    .filter((p) => includeAll || !isDraft(p))
    .flatMap((p) => p.tags)
  const snippetTags = allSnippets
    .filter((s) => includeAll || !isSnippetDraft(s))
    .flatMap((s) => s.tags)
  const unique = Array.from(new Set([...postTags, ...snippetTags]))
  return unique.map((tag) => ({ tag: encodeURIComponent(tag) }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { tag: encodedTag } = await params
  const tag = decodeURIComponent(encodedTag)
  const description = `Articles and snippets tagged with "${tag}" on ${siteConfig.handle}.`
  return {
    title: `#${tag}`,
    description,
    alternates: { canonical: `/learn/tags/${encodedTag}` },
    openGraph: {
      type: "website",
      url: `/learn/tags/${encodedTag}`,
      siteName: siteConfig.handle,
      title: `#${tag} | ${siteConfig.name}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `#${tag} | ${siteConfig.name}`,
      description,
    },
  }
}

export default async function TagPage(
  { params }: { params: Promise<Params> }
) {
  const { tag: encodedTag } = await params
  const tag = decodeURIComponent(encodedTag)

  const posts = getAllPostsForRender().filter((p) => p.tags.includes(tag))
  const snippets = getAllSnippetsForRender().filter((s) => s.tags.includes(tag))

  if (posts.length === 0 && snippets.length === 0) notFound()

  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-20">
      <nav aria-label="Breadcrumb" className="mx-auto flex w-full max-w-5xl items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">
          Learn
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        <span className="text-foreground">#{tag}</span>
      </nav>

      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          #{tag}
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          {posts.length > 0 && snippets.length > 0
            ? `${posts.length} article${posts.length === 1 ? "" : "s"} and ${snippets.length} snippet${snippets.length === 1 ? "" : "s"}`
            : posts.length > 0
              ? `${posts.length} article${posts.length === 1 ? "" : "s"}`
              : `${snippets.length} snippet${snippets.length === 1 ? "" : "s"}`}
        </p>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16">
        {posts.length > 0 ? (
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold tracking-tight">Articles</h2>
            <ArticlesGrid posts={posts} />
          </section>
        ) : null}

        {snippets.length > 0 ? (
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold tracking-tight">Snippets</h2>
            <SnippetsGrid snippets={snippets} />
          </section>
        ) : null}
      </div>
    </div>
  )
}
