import type { MetadataRoute } from "next"
import { allPosts, allSnippets, allFolios } from "content-collections"
import { siteConfig } from "@/lib/config"
import { isDraft } from "@/lib/posts"
import { isSnippetDraft } from "@/lib/snippets"
import { isFolioDraft } from "@/lib/folios"
import {
  CATEGORY_VALUES,
  getAllPublishedBookmarks,
  getPublishedCategoryCounts,
} from "@/lib/bookmarks"

function url(path: string) {
  return new URL(path, siteConfig.url).toString()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: url("/about"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/contact"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/newsletter"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/privacy"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: url("/sponsor"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/learn"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/learn/articles"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/learn/snippets"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/learn/folios"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/bookmarks"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ]

  const publishedPosts = allPosts.filter((p) => !isDraft(p))
  for (const post of publishedPosts) {
    entries.push({
      url: url(`/learn/articles/${post.slug}`),
      lastModified: new Date(post.updatedAt ?? post.publishedAt!),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  const publishedSnippets = allSnippets.filter((s) => !isSnippetDraft(s))
  for (const snippet of publishedSnippets) {
    entries.push({
      url: url(`/learn/snippets/${snippet.slug}`),
      lastModified: new Date(snippet.publishedAt!),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  const publishedFolios = allFolios.filter((f) => !isFolioDraft(f))
  for (const folio of publishedFolios) {
    entries.push({
      url: url(`/learn/folios/${folio.slug}`),
      lastModified: new Date(folio.updatedAt ?? folio.publishedAt!),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  const allTags = Array.from(
    new Set([
      ...publishedPosts.flatMap((p) => p.tags),
      ...publishedSnippets.flatMap((s) => s.tags),
    ])
  )
  for (const tag of allTags) {
    entries.push({
      url: url(`/learn/tags/${encodeURIComponent(tag)}`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    })
  }

  const [counts, publishedBookmarks] = await Promise.all([
    getPublishedCategoryCounts(),
    getAllPublishedBookmarks(),
  ])

  for (const category of CATEGORY_VALUES) {
    if (counts[category] === 0) continue
    entries.push({
      url: url(`/bookmarks/${category}`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  }

  for (const bookmark of publishedBookmarks) {
    entries.push({
      url: url(`/bookmarks/${bookmark.category}/${bookmark.slug}`),
      lastModified: new Date(bookmark.updatedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  }

  return entries
}
