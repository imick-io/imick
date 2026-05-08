export type FolioItem = { type: "article" | "snippet"; slug: string }

export function validateFolioItems(
  items: FolioItem[],
  folioPublishedAt: string | undefined,
  posts: Array<{ slug: string; publishedAt?: string }>,
  snippets: Array<{ slug: string; publishedAt?: string }>
): void {
  if (items.length < 2) {
    throw new Error(`Folio must have at least 2 items, got ${items.length}`)
  }

  const seen = new Set<string>()
  for (const item of items) {
    const key = `${item.type}:${item.slug}`
    if (seen.has(key)) {
      throw new Error(`Folio has duplicate item: ${key}`)
    }
    seen.add(key)

    const collection = item.type === "article" ? posts : snippets
    const match = collection.find((entry) => entry.slug === item.slug)
    if (!match) {
      throw new Error(
        `Folio item ${item.type} "${item.slug}" does not exist in the ${item.type === "article" ? "posts" : "snippets"} collection`
      )
    }

    if (folioPublishedAt && match.publishedAt) {
      const folioDate = new Date(folioPublishedAt).getTime()
      const itemDate = new Date(match.publishedAt).getTime()
      if (itemDate > folioDate) {
        throw new Error(
          `Folio item ${item.type} "${item.slug}" is future-dated (${match.publishedAt}) relative to the folio's publishedAt (${folioPublishedAt})`
        )
      }
    }
  }
}

export function isFolioDraft(folio: { publishedAt?: string }): boolean {
  if (!folio.publishedAt) return true
  const published = new Date(folio.publishedAt).getTime()
  if (Number.isNaN(published)) return true
  return published > Date.now()
}
