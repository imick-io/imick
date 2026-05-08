import { cache } from "react"
import { asc } from "drizzle-orm"
import { db } from "./db"
import { categories, type Category } from "./db/schema"

export type { Category }

export const getAllCategories = cache(async (): Promise<Category[]> => {
  return db.select().from(categories).orderBy(asc(categories.label))
})

export const getCategoryMap = cache(async (): Promise<Record<string, string>> => {
  const rows = await getAllCategories()
  return Object.fromEntries(rows.map((r) => [r.slug, r.label]))
})

export function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join(" ")
}

export function getCategoryLabel(
  slug: string | null | undefined,
  map?: Record<string, string>
): string {
  if (!slug) return "Uncategorized"
  if (map && map[slug]) return map[slug]
  return humanizeSlug(slug)
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
