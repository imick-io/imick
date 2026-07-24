import { getRecipeBySlug, type Recipe } from "./recipes"
import type { Bookmark } from "./db/schema"

// Curated for the home page cooking tile: varied courses, each with a
// brand emoji glyph in components/home/brand-emoji.tsx.
export const FEATURED_RECIPE_SLUGS = [
  "smash-burgers",
  "slow-beef-ragu",
  "basque-cheesecake",
  "shakshuka",
] as const

export function getFeaturedRecipes(): Recipe[] {
  return FEATURED_RECIPE_SLUGS.map((slug) => getRecipeBySlug(slug)).filter(
    (recipe): recipe is Recipe => recipe !== undefined
  )
}

// The db module throws at import time when DATABASE_URL is missing, so the
// import itself has to live inside the try block for the fallback to work.
export async function getHomeBookmarks(limit = 3): Promise<Bookmark[]> {
  try {
    const { getRecentlyReviewedBookmarks } = await import("./bookmarks")
    return await getRecentlyReviewedBookmarks(limit)
  } catch {
    return []
  }
}
