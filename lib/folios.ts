import { allFolios, type Folio } from "content-collections"

import { isFolioDraft, type FolioItem } from "./folios-validation"

export {
  isFolioDraft,
  validateFolioItems,
  type FolioItem,
} from "./folios-validation"

export type FolioForItem = {
  folio: Folio
  position: number
  total: number
  previous: FolioItem | null
  next: FolioItem | null
}

export function getAllFoliosForRender(): Array<Folio & { isDraft: boolean }> {
  const showDrafts = process.env.NODE_ENV !== "production"
  return allFolios
    .map((folio) => ({ ...folio, isDraft: isFolioDraft(folio) }))
    .filter((folio) => showDrafts || !folio.isDraft)
    .sort((a, b) => {
      const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return bDate - aDate
    })
}

export function getFoliosForItem(
  type: "article" | "snippet",
  slug: string
): FolioForItem[] {
  const showDrafts = process.env.NODE_ENV !== "production"
  const results: FolioForItem[] = []

  for (const folio of allFolios) {
    if (!showDrafts && isFolioDraft(folio)) continue

    const index = folio.items.findIndex(
      (item) => item.type === type && item.slug === slug
    )
    if (index === -1) continue

    results.push({
      folio,
      position: index + 1,
      total: folio.items.length,
      previous: index > 0 ? folio.items[index - 1] : null,
      next: index < folio.items.length - 1 ? folio.items[index + 1] : null,
    })
  }

  return results
}
