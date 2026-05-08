import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { BookmarksGrid } from "@/components/bookmarks/bookmarks-grid"
import { CategoryFilters } from "@/components/bookmarks/category-filters"
import { siteConfig } from "@/lib/config"
import {
  getCategoryLabel,
  getDistinctCategories,
  getPublishedBookmarksByCategory,
  getPublishedTagsForCategory,
  isBookmarkSort,
} from "@/lib/bookmarks"

export const revalidate = 3600

type Params = { category: string }
type SearchParams = { tag?: string; sort?: string }

export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getDistinctCategories({ publishedOnly: true })
  return categories.map((category) => ({ category }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { category } = await params
  const known = await getDistinctCategories({ publishedOnly: true })
  if (!known.includes(category)) return {}
  const label = getCategoryLabel(category)
  const description = `${label} bookmarks — tools and resources I rely on, curated by ${siteConfig.name}.`
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
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { category } = await params
  const known = await getDistinctCategories({ publishedOnly: true })
  if (!known.includes(category)) notFound()

  const { tag: rawTag, sort: rawSort } = await searchParams
  const sort = isBookmarkSort(rawSort) ? rawSort : "newest"

  const tags = await getPublishedTagsForCategory(category)
  const activeTag = rawTag && tags.includes(rawTag) ? rawTag : undefined

  const bookmarks = await getPublishedBookmarksByCategory(category, {
    sort,
    tag: activeTag,
  })

  const label = getCategoryLabel(category)

  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-20">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex w-full max-w-5xl items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/bookmarks" className="hover:text-foreground">
          Bookmarks
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        <span className="text-foreground">{label}</span>
      </nav>

      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Bookmarks</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{label}</h1>
        <p className="text-base text-muted-foreground md:text-lg">
          {bookmarks.length === 0
            ? "Nothing here yet."
            : `${bookmarks.length} ${bookmarks.length === 1 ? "bookmark" : "bookmarks"}`}
        </p>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <CategoryFilters
          category={category}
          tags={tags}
          activeTag={activeTag}
          sort={sort}
        />
        <BookmarksGrid key={`${activeTag ?? "all"}-${sort}`} bookmarks={bookmarks} />
      </section>
    </div>
  )
}
