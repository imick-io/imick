import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { BookmarksFilteredView } from "@/components/bookmarks/bookmarks-filtered-view"
import { siteConfig } from "@/lib/config"
import { getAllPublishedBookmarks, getPublishedCategoryCounts } from "@/lib/bookmarks"
import { getCategoryMap } from "@/lib/categories"
import { buildTagMap } from "@/lib/bookmarks-filter"

export const revalidate = 3600

const description = `Tools, libraries, and resources I rely on -- curated and reviewed by ${siteConfig.name}.`

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

export default async function BookmarksHubPage() {
  const [bookmarks, categoryMap, categoryCounts] = await Promise.all([
    getAllPublishedBookmarks(),
    getCategoryMap(),
    getPublishedCategoryCounts(),
  ])

  const tagMap = buildTagMap(bookmarks)

  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-20">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Bookmarks</p>
        <h1 className="font-heading text-4xl font-normal tracking-tight md:text-5xl">
          Tools, libraries, and resources
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          A curated list of what I reach for, organized by category and reviewed where it
          counts.
        </p>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {/* nuqs reads search params, which bails out of static rendering up to
            the nearest Suspense boundary. */}
        <Suspense>
          <BookmarksFilteredView
            bookmarks={bookmarks}
            categoryMap={categoryMap}
            categoryCounts={categoryCounts}
            tagMap={tagMap}
          />
        </Suspense>
      </section>

      <p className="mx-auto w-full max-w-5xl text-sm text-muted-foreground">
        I write about some of these in{" "}
        <Link
          href="/learn"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Learn
        </Link>
        .
      </p>
    </div>
  )
}
