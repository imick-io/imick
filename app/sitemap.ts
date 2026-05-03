import type { MetadataRoute } from "next"
import { allPosts, allSnippets } from "content-collections"
import { siteConfig } from "@/lib/config"
import { isDraft } from "@/lib/posts"
import { isSnippetDraft } from "@/lib/snippets"

function url(path: string) {
  return new URL(path, siteConfig.url).toString()
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: url("/about"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/contact"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/sponsor"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/learn"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/learn/articles"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/learn/snippets"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
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

  return entries
}
