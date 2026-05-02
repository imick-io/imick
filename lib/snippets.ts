import { allSnippets, type Snippet } from "content-collections"

export function isSnippetDraft(snippet: Snippet): boolean {
  if (!snippet.publishedAt) return true
  const published = new Date(snippet.publishedAt).getTime()
  if (Number.isNaN(published)) return true
  return published > Date.now()
}

export function getAllSnippetsForRender(): Array<Snippet & { isDraft: boolean }> {
  const showDrafts = process.env.NODE_ENV !== "production"
  return allSnippets
    .map((snippet) => ({ ...snippet, isDraft: isSnippetDraft(snippet) }))
    .filter((snippet) => showDrafts || !snippet.isDraft)
    .sort((a, b) => {
      const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return bDate - aDate
    })
}

export function getSnippetBySlug(
  slug: string
): (Snippet & { isDraft: boolean }) | null {
  const snippet = allSnippets.find((s) => s.slug === slug)
  if (!snippet) return null
  const draft = isSnippetDraft(snippet)
  if (draft && process.env.NODE_ENV === "production") return null
  return { ...snippet, isDraft: draft }
}

export function getRelatedSnippets(
  current: Snippet & { isDraft: boolean },
  limit = 3
): Array<Snippet & { isDraft: boolean }> {
  const others = getAllSnippetsForRender().filter(
    (s) => s.slug !== current.slug && !s.isDraft
  )
  const scored = others
    .map((s) => {
      const tagOverlap = s.tags.filter((t) => current.tags.includes(t)).length
      const langScore = s.language === current.language ? 2 : 0
      return { snippet: s, score: tagOverlap + langScore }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      const aDate = a.snippet.publishedAt ? new Date(a.snippet.publishedAt).getTime() : 0
      const bDate = b.snippet.publishedAt ? new Date(b.snippet.publishedAt).getTime() : 0
      return bDate - aDate
    })
  return scored.slice(0, limit).map((x) => x.snippet)
}
