import { COURSES, type Course } from "./recipes-taxonomy"
import type { Recipe } from "./recipes"

export type RecipeFilters = {
  course?: Course
  ingredient?: string
  tags?: string[]
  q?: string
}

function matchesQuery(r: Recipe, q: string): boolean {
  return (
    r.name.toLowerCase().includes(q) ||
    r.primary.toLowerCase().includes(q) ||
    r.ingredients.some((ing) => ing.item.toLowerCase().includes(q))
  )
}

export function filterRecipes(recipes: Recipe[], filters: RecipeFilters): Recipe[] {
  const q = filters.q?.trim().toLowerCase()
  const bySlug = new Map(recipes.map((r) => [r.slug, r]))
  // Ingredient and search filters match transitively through component
  // recipes: a pot pie matches "Chicken" because its filling does. Course
  // stays direct — the pot pie is Mains even though its crust is Basics.
  const withComponents = (r: Recipe): Recipe[] => [
    r,
    ...(r.components ?? [])
      .map((slug) => bySlug.get(slug))
      .filter((c): c is Recipe => c !== undefined),
  ]
  return recipes.filter((r) => {
    if (filters.course && r.course !== filters.course) return false
    if (
      filters.ingredient &&
      !withComponents(r).some((c) => c.primary === filters.ingredient)
    )
      return false
    if (filters.tags && !filters.tags.every((t) => r.tags.includes(t as Recipe["tags"][number])))
      return false
    if (q && !withComponents(r).some((c) => matchesQuery(c, q))) return false
    return true
  })
}

export function hasActiveFilters(filters: RecipeFilters): boolean {
  return Boolean(
    filters.course ||
      filters.ingredient ||
      (filters.tags && filters.tags.length > 0) ||
      filters.q?.trim()
  )
}

export function courseCounts(recipes: Recipe[]): Record<Course, number> {
  const counts = Object.fromEntries(COURSES.map((c) => [c, 0])) as Record<Course, number>
  for (const r of recipes) counts[r.course] += 1
  return counts
}

export function ingredientsByCourse(recipes: Recipe[]): Record<Course, string[]> {
  const map = Object.fromEntries(COURSES.map((c) => [c, new Set<string>()])) as Record<
    Course,
    Set<string>
  >
  for (const r of recipes) map[r.course].add(r.primary)
  return Object.fromEntries(
    COURSES.map((c) => [c, Array.from(map[c]).sort((a, b) => a.localeCompare(b))])
  ) as Record<Course, string[]>
}

export function groupByCourse(recipes: Recipe[]): Array<{ course: Course; recipes: Recipe[] }> {
  return COURSES.map((course) => ({
    course,
    recipes: recipes.filter((r) => r.course === course),
  })).filter((g) => g.recipes.length > 0)
}
