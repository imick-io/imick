import type { Metadata } from "next"
import { BookmarksFilteredView } from "@/components/bookmarks/bookmarks-filtered-view"
import { siteConfig } from "@/lib/config"
import { getAllPublishedBookmarks } from "@/lib/bookmarks"
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
  const [bookmarks, categoryMap] = await Promise.all([
    getAllPublishedBookmarks(),
    getCategoryMap(),
  ])

  const tagMap = buildTagMap(bookmarks)

  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-20">
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

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <BookmarksFilteredView
          bookmarks={bookmarks}
          categoryMap={categoryMap}
          tagMap={tagMap}
        />
      </section>
    </div>
  )
}
