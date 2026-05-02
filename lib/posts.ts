import { allPosts, type Post } from "content-collections"

export type PublishedPost = Post & { publishedAt: string }

export function isDraft(post: Post): boolean {
  if (!post.publishedAt) return true
  const published = new Date(post.publishedAt).getTime()
  if (Number.isNaN(published)) return true
  return published > Date.now()
}

export function getAllPostsForRender(): Array<Post & { isDraft: boolean }> {
  const showDrafts = process.env.NODE_ENV !== "production"
  const enriched = allPosts.map((post) => ({ ...post, isDraft: isDraft(post) }))
  return enriched
    .filter((post) => showDrafts || !post.isDraft)
    .sort((a, b) => {
      const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return bDate - aDate
    })
}

export function getPostBySlug(slug: string): (Post & { isDraft: boolean }) | null {
  const post = allPosts.find((p) => p.slug === slug)
  if (!post) return null
  const draft = isDraft(post)
  if (draft && process.env.NODE_ENV === "production") return null
  return { ...post, isDraft: draft }
}

export function formatPostDate(value: string | undefined): string {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const categoryLabel: Record<Post["category"], string> = {
  opinion: "Opinion",
  technical: "Technical",
  other: "Other",
}
