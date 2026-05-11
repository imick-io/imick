import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { BookmarksFilteredView } from "@/components/bookmarks/bookmarks-filtered-view"
import { siteConfig } from "@/lib/config"
import {
  getDistinctCategories,
  getAllPublishedBookmarks,
} from "@/lib/bookmarks"
import { getCategoryLabel, getCategoryMap } from "@/lib/categories"
import { buildTagMap } from "@/lib/bookmarks-filter"

export const revalidate = 3600

type Params = { category: string }

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
  const known = await getDistinctCategories({ publishedOnly: true })
  if (!known.includes(category)) notFound()

  const [bookmarks, categoryMap] = await Promise.all([
    getAllPublishedBookmarks(),
    getCategoryMap(),
  ])

  const tagMap = buildTagMap(bookmarks)
  const label = getCategoryLabel(category, categoryMap)

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
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <BookmarksFilteredView
          bookmarks={bookmarks}
          categoryMap={categoryMap}
          tagMap={tagMap}
          category={category}
        />
      </section>
    </div>
  )
}
