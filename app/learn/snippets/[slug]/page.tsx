import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allSnippets } from "content-collections"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { MDXContent } from "@/components/mdx/mdx-content"
import { RelatedSnippets } from "@/components/learn/related-snippets"
import { SourceLink } from "@/components/learn/source-link"
import { siteConfig } from "@/lib/config"
import { formatPostDate } from "@/lib/posts"
import { getRelatedSnippets, getSnippetBySlug, isSnippetDraft } from "@/lib/snippets"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  const includeAll = process.env.NODE_ENV !== "production"
  return allSnippets
    .filter((snippet) => includeAll || !isSnippetDraft(snippet))
    .map((snippet) => ({ slug: snippet.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const snippet = getSnippetBySlug(slug)
  if (!snippet) return {}
  const url = `/learn/snippets/${snippet.slug}`
  const description = snippet.description ?? `${snippet.language} snippet — ${snippet.title}`
  return {
    title: snippet.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.handle,
      title: snippet.title,
      description,
      publishedTime: snippet.publishedAt,
      tags: snippet.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: snippet.title,
      description,
    },
  }
}

export default async function SnippetPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const snippet = getSnippetBySlug(slug)
  if (!snippet) notFound()

  const related = getRelatedSnippets(snippet)

  return (
    <article className="flex flex-col gap-12 px-6 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="mx-auto flex w-full max-w-3xl items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">
          Learn
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        <Link href="/learn/snippets" className="hover:text-foreground">
          Snippets
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        <span className="truncate text-foreground">{snippet.title}</span>
      </nav>

      <header className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {snippet.isDraft ? (
          <span className="self-start rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
            DRAFT
          </span>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          {snippet.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-foreground">
            {snippet.language}
          </span>
          <span aria-hidden>·</span>
          <span>{formatPostDate(snippet.publishedAt) || "Unscheduled"}</span>
          {snippet.tags.length > 0 ? (
            <>
              <span aria-hidden>·</span>
              <ul className="flex flex-wrap gap-1.5">
                {snippet.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/learn/tags/${encodeURIComponent(tag)}`}
                      className="rounded-full border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        {snippet.description ? (
          <p className="text-lg text-muted-foreground">{snippet.description}</p>
        ) : null}
      </header>

      <div className="mx-auto w-full max-w-3xl text-base leading-relaxed text-foreground [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-muted-foreground hover:[&_a]:decoration-foreground [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:font-mono">
        <MDXContent code={snippet.code} />
      </div>

      <footer className="mx-auto flex w-full max-w-3xl items-center justify-end border-t border-border pt-6">
        <SourceLink sourcePath={snippet.sourcePath} />
      </footer>

      {related.length > 0 ? <RelatedSnippets snippets={related} /> : null}
    </article>
  )
}
