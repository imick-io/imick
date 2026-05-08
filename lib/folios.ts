import { allFolios, type Folio } from "content-collections"

import { isFolioDraft } from "./folios-validation"

export {
  isFolioDraft,
  validateFolioItems,
  type FolioItem,
} from "./folios-validation"

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
