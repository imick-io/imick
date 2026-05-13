import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allFolios, allPosts, allSnippets } from "content-collections"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { MDXContent } from "@/components/mdx/mdx-content"
import { siteConfig } from "@/lib/config"
import { isFolioDraft, type FolioItem } from "@/lib/folios"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  const includeAll = process.env.NODE_ENV !== "production"
  return allFolios
    .filter((folio) => includeAll || !isFolioDraft(folio))
    .map((folio) => ({ slug: folio.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const folio = getFolioForRender(slug)
  if (!folio) return {}
  const url = `/learn/folios/${folio.slug}`
  return {
    title: folio.title,
    description: folio.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.handle,
      title: folio.title,
      description: folio.excerpt,
      publishedTime: folio.publishedAt,
      modifiedTime: folio.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: folio.title,
      description: folio.excerpt,
    },
  }
}

function getFolioForRender(slug: string) {
  const folio = allFolios.find((f) => f.slug === slug)
  if (!folio) return null
  const draft = isFolioDraft(folio)
  if (draft && process.env.NODE_ENV === "production") return null
  return { ...folio, isDraft: draft }
}

function resolveItem(item: FolioItem): { href: string; title: string } {
  if (item.type === "article") {
    const post = allPosts.find((p) => p.slug === item.slug)!
    return { href: `/learn/articles/${post.slug}`, title: post.title }
  }
  const snippet = allSnippets.find((s) => s.slug === item.slug)!
  return { href: `/learn/snippets/${snippet.slug}`, title: snippet.title }
}

export default async function FolioPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const folio = getFolioForRender(slug)
  if (!folio) notFound()

  const resolvedItems = folio.items.map((item) => ({ item, resolved: resolveItem(item) }))

  return (
    <article className="flex flex-col gap-12 px-6 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="mx-auto flex w-full max-w-3xl items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">
          Learn
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        <Link href="/learn/folios" className="hover:text-foreground">
          Folios
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        <span className="truncate text-foreground">{folio.title}</span>
      </nav>

      <header className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {folio.isDraft ? (
          <span className="self-start rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
            DRAFT
          </span>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          {folio.title}
        </h1>
        <p className="text-lg text-muted-foreground">{folio.excerpt}</p>
      </header>

      <div className="mx-auto w-full max-w-3xl text-base leading-relaxed text-foreground [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-muted-foreground hover:[&_a]:decoration-foreground [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:font-mono">
        <MDXContent code={folio.code} />
      </div>

      <section
        aria-label="Folio items"
        className="mx-auto flex w-full max-w-3xl flex-col gap-3 border-t border-border pt-8"
      >
        <h2 className="text-sm font-medium text-muted-foreground">In this folio</h2>
        <ol className="flex flex-col gap-2">
          {resolvedItems.map(({ item, resolved }, index) => (
            <li key={`${item.type}:${item.slug}`}>
              <Link
                href={resolved.href}
                className="flex items-baseline gap-3 rounded-md border border-border bg-card px-4 py-3 transition-colors hover:border-foreground/30"
              >
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-base font-medium text-foreground">{resolved.title}</span>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {item.type}
                  </span>
                </span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}
