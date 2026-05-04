import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { buttonVariants } from "@/components/ui/button"
import { getPublishedBookmark, CATEGORY_LABELS } from "@/lib/bookmarks"
import { categoryEnum } from "@/lib/db/schema"

export const revalidate = 3600

type Props = { params: Promise<{ category: string; slug: string }> }

export async function generateStaticParams() {
  // Returns empty array at build time — pages generated on first request + revalidated
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const bookmark = await getPublishedBookmark(category, slug)
  if (!bookmark) return {}
  return {
    title: bookmark.title,
    description: bookmark.description ?? undefined,
  }
}

export default async function BookmarkDetailPage({ params }: Props) {
  const { category, slug } = await params
  const bookmark = await getPublishedBookmark(category, slug)
  if (!bookmark) notFound()

  const categoryLabel =
    CATEGORY_LABELS[bookmark.category as (typeof categoryEnum.enumValues)[number]] ?? bookmark.category

  const isReviewed = bookmark.rating != null || bookmark.reviewText != null

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-2">
        <Link href="/bookmarks" className="hover:text-foreground transition-colors">
          Bookmarks
        </Link>
        <span>/</span>
        <Link href={`/bookmarks/${category}`} className="hover:text-foreground transition-colors">
          {categoryLabel}
        </Link>
      </nav>

      {/* Header */}
      <div
        className="rounded-xl border p-6 space-y-4"
        style={bookmark.colorHex ? { borderLeftColor: bookmark.colorHex, borderLeftWidth: 4 } : {}}
      >
        <div className="flex items-start gap-4">
          {bookmark.logoUrl && (
            <Image
              src={bookmark.logoUrl}
              alt={`${bookmark.title} logo`}
              width={48}
              height={48}
              className="rounded-lg shrink-0"
              unoptimized
            />
          )}
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold leading-tight">{bookmark.title}</h1>
            {bookmark.description && (
              <p className="text-muted-foreground">{bookmark.description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-muted">
            {categoryLabel}
          </span>
          {bookmark.tags.map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
          {isReviewed && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
              Reviewed
            </span>
          )}
        </div>

        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "default", size: "lg" })}
        >
          Visit site
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
        </a>
      </div>

      {/* Review */}
      {isReviewed && (
        <div className="space-y-6">
          {bookmark.rating != null && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rating</span>
              <span className="text-lg">
                {"★".repeat(bookmark.rating)}{"☆".repeat(5 - bookmark.rating)}
              </span>
              <span className="text-sm text-muted-foreground">({bookmark.rating}/5)</span>
            </div>
          )}

          {bookmark.pros && (
            <div className="space-y-2">
              <h2 className="font-semibold text-sm text-green-600 dark:text-green-400">Pros</h2>
              <ul className="space-y-1">
                {bookmark.pros.split("\n").filter(Boolean).map((line, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-green-500 shrink-0">+</span>
                    {line.replace(/^[-•+]\s*/, "")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {bookmark.cons && (
            <div className="space-y-2">
              <h2 className="font-semibold text-sm text-red-600 dark:text-red-400">Cons</h2>
              <ul className="space-y-1">
                {bookmark.cons.split("\n").filter(Boolean).map((line, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-red-500 shrink-0">−</span>
                    {line.replace(/^[-•+]\s*/, "")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {bookmark.reviewText && (
            <div className="space-y-2">
              <h2 className="font-semibold text-sm">Review</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {bookmark.reviewText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
