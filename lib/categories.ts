import { cache } from "react"
import { asc, eq } from "drizzle-orm"
import { db } from "./db"
import { categories, type Category } from "./db/schema"
import { humanizeSlug } from "./bookmarks-meta"

export type { Category }
export { humanizeSlug }
export { getCategoryLabel } from "./categories-meta"

export const getAllCategories = cache(async (): Promise<Category[]> => {
  return db.select().from(categories).orderBy(asc(categories.label))
})

export const getCategoryMap = cache(async (): Promise<Record<string, string>> => {
  const rows = await getAllCategories()
  return Object.fromEntries(rows.map((r) => [r.slug, r.label]))
})

export async function categoryExists(slug: string): Promise<boolean> {
  const rows = await db
    .select({ slug: categories.slug })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1)
  return rows.length > 0
}

export async function createCategory(input: {
  slug: string
  label: string
}): Promise<{ slug: string }> {
  const [row] = await db
    .insert(categories)
    .values(input)
    .onConflictDoNothing()
    .returning({ slug: categories.slug })
  return { slug: row?.slug ?? input.slug }
}
