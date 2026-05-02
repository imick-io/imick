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
