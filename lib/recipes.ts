import { allRecipes, type Recipe as RecipeDoc } from "content-collections"
import type { Course, Ingredient, RecipeTag, Step } from "./recipes-taxonomy"

export { COURSES, RECIPE_TAGS } from "./recipes-taxonomy"
export type { Course, Ingredient, RecipeTag, Step }

export type Recipe = {
  slug: string
  name: string
  intro: string
  course: Course
  primary: string
  tags: RecipeTag[]
  minutes: number
  servings: number
  publishedAt?: string
  image: string
  imageAlt: string
  // Slugs of component recipes this complete recipe is assembled from.
  components?: string[]
  ingredients: Ingredient[]
  steps: Step[]
  isDraft: boolean
}

function isDraft(doc: { publishedAt?: string }): boolean {
  if (!doc.publishedAt) return true
  const published = new Date(doc.publishedAt).getTime()
  if (Number.isNaN(published)) return true
  return published > Date.now()
}

function toRecipe(doc: RecipeDoc): Recipe {
  return {
    slug: doc.slug,
    name: doc.name,
    intro: doc.intro,
    course: doc.course,
    primary: doc.primary,
    tags: doc.tags,
    minutes: doc.minutes,
    servings: doc.servings,
    publishedAt: doc.publishedAt,
    image: doc.image,
    imageAlt: doc.imageAlt,
    components: doc.components,
    ingredients: doc.ingredients,
    steps: doc.steps,
    isDraft: isDraft(doc),
  }
}

export function getAllRecipes(): Recipe[] {
  const showDrafts = process.env.NODE_ENV !== "production"
  return allRecipes.map(toRecipe).filter((r) => showDrafts || !r.isDraft)
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return getAllRecipes().find((r) => r.slug === slug)
}

export function getComponentRecipes(recipe: Recipe): Recipe[] {
  const all = getAllRecipes()
  return (recipe.components ?? [])
    .map((slug) => all.find((r) => r.slug === slug))
    .filter((r): r is Recipe => r !== undefined)
}

export function getRecipesUsing(slug: string): Recipe[] {
  return getAllRecipes().filter((r) => r.components?.includes(slug) ?? false)
}

export function getRelatedRecipes(recipe: Recipe, limit = 3): Recipe[] {
  // Component relationships get their own "Components" / "Used in" sections
  // in the UI, so they are excluded here rather than mixed into "related".
  const componentLinked = new Set([
    ...(recipe.components ?? []),
    ...getRecipesUsing(recipe.slug).map((r) => r.slug),
  ])
  return getAllRecipes()
    .filter((r) => r.slug !== recipe.slug && !componentLinked.has(r.slug))
    .map((r) => {
      let score = 0
      if (r.primary === recipe.primary) score += 3
      if (r.course === recipe.course) score += 1
      score += r.tags.filter((t) => recipe.tags.includes(t)).length
      return { r, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ r }) => r)
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

export function formatMinutesISO(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `PT${h > 0 ? `${h}H` : ""}${m > 0 ? `${m}M` : ""}`
}
