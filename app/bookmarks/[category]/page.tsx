import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { BookmarksFilteredView } from "@/components/bookmarks/bookmarks-filtered-view"
import { siteConfig } from "@/lib/config"
import {
  getDistinctCategories,
  getAllPublishedBookmarks,
  getPublishedCategoryCounts,
} from "@/lib/bookmarks"
import { getCategoryLabel, getCategoryMap, humanizeSlug } from "@/lib/categories"
import { buildTagMap } from "@/lib/bookmarks-filter"
import { BookmarksUnavailable } from "@/components/bookmarks/bookmarks-unavailable"
import { readWhenAvailable } from "@/lib/db-availability"

export const revalidate = 3600

type Params = { category: string }

export async function generateStaticParams(): Promise<Params[]> {
  // An outage must not fail the build. With no params the category pages are
  // generated on first request instead, which is also when we can tell the
  // visitor the library is briefly down.
  const categories = await readWhenAvailable(() =>
    getDistinctCategories({ publishedOnly: true })
  )
  if (!categories.ok) return []
  return categories.data.map((category) => ({ category }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { category } = await params
  const known = await readWhenAvailable(() =>
    getDistinctCategories({ publishedOnly: true })
  )
  if (!known.ok || !known.data.includes(category)) return {}
  const label = getCategoryLabel(category, await getCategoryMap())
  const description = `${label} bookmarks -- tools and resources I rely on, curated by ${siteConfig.name}.`
  return {
    title: label,
    description,
    alternates: { canonical: `/bookmarks/${category}` },
    openGraph: {
      type: "website",
      url: `/bookmarks/${category}`,
      siteName: siteConfig.handle,
      title: `${label} | Bookmarks | ${siteConfig.name}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} | Bookmarks | ${siteConfig.name}`,
      description,
    },
  }
}

export default async function BookmarkCategoryPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { category } = await params

  const view = await readWhenAvailable(async () => {
    const known = await getDistinctCategories({ publishedOnly: true })
    const [bookmarks, categoryMap, categoryCounts] = await Promise.all([
      getAllPublishedBookmarks(),
      getCategoryMap(),
      getPublishedCategoryCounts(),
    ])
    return { known, bookmarks, categoryMap, categoryCounts }
  })

  // Only a reachable database can tell us a category does not exist. While it
  // is down every category is unknown, so 404ing here would bury real pages.
  if (view.ok && !view.data.known.includes(category)) notFound()

  const label = view.ok
    ? getCategoryLabel(category, view.data.categoryMap)
    : humanizeSlug(category)

  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-20">
      <Breadcrumb
        className="mx-auto w-full max-w-5xl"
        items={[{ label: "Bookmarks", href: "/bookmarks" }, { label }]}
      />

      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Bookmarks
        </p>
        <h1 className="font-heading text-4xl font-normal tracking-tight md:text-5xl">
          {label}
        </h1>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {/* nuqs reads search params, which bails out of static rendering up to
            the nearest Suspense boundary. */}
        {view.ok ? (
          <Suspense>
            <BookmarksFilteredView
              bookmarks={view.data.bookmarks}
              categoryMap={view.data.categoryMap}
              categoryCounts={view.data.categoryCounts}
              tagMap={buildTagMap(view.data.bookmarks)}
              category={category}
            />
          </Suspense>
        ) : (
          <BookmarksUnavailable />
        )}
      </section>
    </div>
  )
}
