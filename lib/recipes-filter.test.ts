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
    image: `/assets/recipes/${overrides.slug}.jpg`,
    imageAlt: "",
    ingredients: [],
    steps: [],
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
    slug: "soup",
    name: "Red Lentil Soup",
    course: "Lunch",
    primary: "Lentils",
    tags: ["Freezer-Friendly", "Meal Prep"],
  }),
]

function slugs(result: Recipe[]): string[] {
  return result.map((r) => r.slug)
}

describe("filterRecipes", () => {
  it("returns everything with no filters", () => {
    expect(filterRecipes(recipes, {})).toHaveLength(3)
  })

  it("filters by course", () => {
    expect(slugs(filterRecipes(recipes, { course: "Breakfast" }))).toEqual(["oats"])
  })

  it("filters by primary ingredient", () => {
    expect(slugs(filterRecipes(recipes, { ingredient: "Lentils" }))).toEqual(["soup"])
  })

  it("requires every selected tag", () => {
    expect(slugs(filterRecipes(recipes, { tags: ["Meal Prep"] }))).toEqual(["oats", "soup"])
    expect(slugs(filterRecipes(recipes, { tags: ["Meal Prep", "Quick"] }))).toEqual(["oats"])
  })

  it("matches search against name, primary, and ingredients", () => {
    expect(slugs(filterRecipes(recipes, { q: "lentil" }))).toEqual(["soup"])
    expect(slugs(filterRecipes(recipes, { q: "mozzarella" }))).toEqual(["parm"])
    expect(filterRecipes(recipes, { q: "  " })).toHaveLength(3)
  })

  it("combines filters", () => {
    expect(
      slugs(filterRecipes(recipes, { course: "Lunch", tags: ["Meal Prep"] }))
    ).toEqual(["soup"])
    expect(filterRecipes(recipes, { course: "Lunch", tags: ["Quick"] })).toHaveLength(0)
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
    expect(counts.Mains).toBe(1)
    expect(counts.Breakfast).toBe(1)
    expect(counts.Dessert).toBe(0)
  })

  it("lists ingredients per course sorted", () => {
    const map = ingredientsByCourse(recipes)
    expect(map.Mains).toEqual(["Chicken breast"])
    expect(map.Dessert).toEqual([])
  })

  it("groups recipes in course order, dropping empty courses", () => {
    const groups = groupByCourse(recipes)
    expect(groups.map((g) => g.course)).toEqual(["Breakfast", "Lunch", "Mains"])
  })
})
