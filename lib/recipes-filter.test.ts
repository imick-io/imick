import { describe, it, expect } from "vitest"
import {
  filterRecipes,
  hasActiveFilters,
  courseCounts,
  ingredientsByCourse,
  groupByCourse,
} from "./recipes-filter"
import type { Recipe } from "./recipes"

function makeRecipe(overrides: Partial<Recipe> & { slug: string }): Recipe {
  return {
    name: overrides.slug,
    intro: "",
    course: "Mains",
    primary: "Chicken breast",
    tags: [],
    minutes: 30,
    servings: 2,
    image: `/assets/content/recipes/${overrides.slug}.jpg`,
    imageAlt: "",
    ingredients: [],
    steps: [],
    isDraft: false,
    ...overrides,
  }
}

const recipes: Recipe[] = [
  makeRecipe({
    slug: "parm",
    name: "Chicken Parmigiana",
    course: "Mains",
    primary: "Chicken breast",
    tags: ["Guests", "Comfort Food"],
    ingredients: [{ item: "Mozzarella", grams: 200 }],
  }),
  makeRecipe({
    slug: "oats",
    name: "Overnight Oats",
    course: "Breakfast",
    primary: "Oats",
    tags: ["Meal Prep", "Quick"],
  }),
  makeRecipe({
    slug: "potatoes",
    name: "Crispy Roasted Potatoes",
    course: "Sides",
    primary: "Potatoes",
    tags: ["Freezer-Friendly", "Meal Prep"],
  }),
  makeRecipe({
    slug: "pie-crust",
    name: "Pie Crust",
    course: "Basics",
    primary: "Flour",
    ingredients: [{ item: "Butter", grams: 227 }],
  }),
  makeRecipe({
    slug: "pot-pie-filling",
    name: "Pot Pie Filling",
    course: "Basics",
    primary: "Chicken",
    ingredients: [{ item: "Chicken thighs", grams: 700 }],
  }),
  makeRecipe({
    slug: "pot-pie",
    name: "Chicken Pot Pie",
    course: "Mains",
    primary: "Pie",
    tags: ["Comfort Food"],
    components: ["pie-crust", "pot-pie-filling"],
    ingredients: [{ item: "Pie Crust" }, { item: "Pot Pie Filling" }],
  }),
]

function slugs(result: Recipe[]): string[] {
  return result.map((r) => r.slug)
}

describe("filterRecipes", () => {
  it("returns everything with no filters", () => {
    expect(filterRecipes(recipes, {})).toHaveLength(6)
  })

  it("filters by course", () => {
    expect(slugs(filterRecipes(recipes, { course: "Breakfast" }))).toEqual(["oats"])
  })

  it("filters by primary ingredient", () => {
    expect(slugs(filterRecipes(recipes, { ingredient: "Oats" }))).toEqual(["oats"])
  })

  it("matches primary ingredient transitively through components", () => {
    expect(slugs(filterRecipes(recipes, { ingredient: "Chicken" }))).toEqual([
      "pot-pie-filling",
      "pot-pie",
    ])
    expect(slugs(filterRecipes(recipes, { ingredient: "Flour" }))).toEqual([
      "pie-crust",
      "pot-pie",
    ])
  })

  it("surfaces the complete recipe when combining course and component primary", () => {
    expect(
      slugs(filterRecipes(recipes, { course: "Mains", ingredient: "Chicken" }))
    ).toEqual(["pot-pie"])
  })

  it("keeps course filtering non-transitive", () => {
    expect(slugs(filterRecipes(recipes, { course: "Basics" }))).toEqual([
      "pie-crust",
      "pot-pie-filling",
    ])
  })

  it("ignores component slugs that are not in the list", () => {
    const orphan = makeRecipe({ slug: "orphan", components: ["missing"] })
    expect(filterRecipes([orphan], { ingredient: "Flour" })).toHaveLength(0)
    expect(slugs(filterRecipes([orphan], { ingredient: "Chicken breast" }))).toEqual([
      "orphan",
    ])
  })

  it("requires every selected tag", () => {
    expect(slugs(filterRecipes(recipes, { tags: ["Meal Prep"] }))).toEqual([
      "oats",
      "potatoes",
    ])
    expect(slugs(filterRecipes(recipes, { tags: ["Meal Prep", "Quick"] }))).toEqual([
      "oats",
    ])
  })

  it("matches search against name, primary, and ingredients", () => {
    expect(slugs(filterRecipes(recipes, { q: "mozzarella" }))).toEqual(["parm"])
    expect(slugs(filterRecipes(recipes, { q: "potato" }))).toEqual(["potatoes"])
    expect(filterRecipes(recipes, { q: "  " })).toHaveLength(6)
  })

  it("matches search transitively through component ingredients", () => {
    expect(slugs(filterRecipes(recipes, { q: "chicken thighs" }))).toEqual([
      "pot-pie-filling",
      "pot-pie",
    ])
    expect(slugs(filterRecipes(recipes, { q: "butter" }))).toEqual([
      "pie-crust",
      "pot-pie",
    ])
  })

  it("combines filters", () => {
    expect(
      slugs(filterRecipes(recipes, { course: "Sides", tags: ["Meal Prep"] }))
    ).toEqual(["potatoes"])
    expect(filterRecipes(recipes, { course: "Sides", tags: ["Quick"] })).toHaveLength(0)
  })
})

describe("hasActiveFilters", () => {
  it("is false for empty filters", () => {
    expect(hasActiveFilters({})).toBe(false)
    expect(hasActiveFilters({ tags: [], q: " " })).toBe(false)
  })

  it("is true for any narrowing filter", () => {
    expect(hasActiveFilters({ course: "Mains" })).toBe(true)
    expect(hasActiveFilters({ ingredient: "Oats" })).toBe(true)
    expect(hasActiveFilters({ tags: ["Quick"] })).toBe(true)
    expect(hasActiveFilters({ q: "soup" })).toBe(true)
  })
})

describe("grouping helpers", () => {
  it("counts recipes per course", () => {
    const counts = courseCounts(recipes)
    expect(counts.Mains).toBe(2)
    expect(counts.Breakfast).toBe(1)
    expect(counts.Basics).toBe(2)
    expect(counts.Dessert).toBe(0)
  })

  it("lists ingredients per course sorted", () => {
    const map = ingredientsByCourse(recipes)
    expect(map.Mains).toEqual(["Chicken breast", "Pie"])
    expect(map.Basics).toEqual(["Chicken", "Flour"])
    expect(map.Dessert).toEqual([])
  })

  it("groups recipes in course order, dropping empty courses", () => {
    const groups = groupByCourse(recipes)
    expect(groups.map((g) => g.course)).toEqual([
      "Breakfast",
      "Mains",
      "Sides",
      "Basics",
    ])
  })
})
