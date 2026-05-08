import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { BookmarkCard } from "@/components/bookmarks/bookmark-card"
import { siteConfig } from "@/lib/config"
import {
  getPublishedCategoryCounts,
  getRecentlyReviewedBookmarks,
} from "@/lib/bookmarks"
import { getCategoryLabel, getCategoryMap } from "@/lib/categories"

export const revalidate = 3600

const description = `Tools, libraries, and resources I rely on — curated and reviewed by ${siteConfig.name}.`

export const metadata: Metadata = {
  title: "Bookmarks",
  description,
  alternates: { canonical: "/bookmarks" },
  openGraph: {
    type: "website",
    url: "/bookmarks",
    siteName: siteConfig.handle,
    title: `Bookmarks | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Bookmarks | ${siteConfig.name}`,
    description,
  },
}

const HUB_LIMIT = 6

export default async function BookmarksHubPage() {
  const [recent, counts, categoryMap] = await Promise.all([
    getRecentlyReviewedBookmarks(HUB_LIMIT),
    getPublishedCategoryCounts(),
    getCategoryMap(),
  ])

  const visibleCategories = Object.keys(counts)
    .filter((cat) => counts[cat] > 0)
    .sort((a, b) => a.localeCompare(b))

  return (
    <div className="flex flex-col gap-16 px-6 py-16 md:gap-20 md:py-20">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Bookmarks</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Tools, libraries, and resources
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          A curated list of what I reach for, organized by category and reviewed where it
          counts.
        </p>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Recently Reviewed</h2>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
            First reviews coming soon.
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((bookmark) => (
              <li key={bookmark.id}>
                <BookmarkCard bookmark={bookmark} categoryMap={categoryMap} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <h2 className="text-xl font-semibold tracking-tight">Browse by category</h2>
        {visibleCategories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
            No categories yet — check back soon.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCategories.map((cat) => {
              const count = counts[cat]
              return (
                <li key={cat}>
                  <Link
                    href={`/bookmarks/${cat}`}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-foreground group-hover:underline">
                        {getCategoryLabel(cat, categoryMap)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {count} {count === 1 ? "bookmark" : "bookmarks"}
                      </p>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={16}
                      className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
