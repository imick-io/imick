import { allPosts, type Post } from "content-collections"

import { siteConfig } from "./config"

export function getFeaturedPosts(limit?: number): Post[] {
  const isDev = process.env.NODE_ENV !== "production"
  const cap = limit ?? siteConfig.featuredPostSlugs.length
  const result: Post[] = []
  for (const slug of siteConfig.featuredPostSlugs) {
    if (result.length >= cap) break
    const post = allPosts.find((p) => p.slug === slug)
    if (!post) {
      if (isDev) {
        console.warn(`getFeaturedPosts: missing post slug "${slug}"`)
      }
      continue
    }
    result.push(post)
  }
  return result
}
