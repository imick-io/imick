import { describe, it, expect } from "vitest"
import { getAllRecipes } from "./recipes"

const recipes = getAllRecipes()

describe("recipe data integrity", () => {
  it("has unique slugs", () => {
    const slugs = recipes.map((r) => r.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it("only references existing ingredients from step uses", () => {
    for (const recipe of recipes) {
      const items = new Set(recipe.ingredients.map((ing) => ing.item))
      for (const step of recipe.steps) {
        for (const used of step.uses ?? []) {
          expect(
            items.has(used),
            `${recipe.slug}: step references unknown ingredient "${used}"`
          ).toBe(true)
        }
      }
    }
  })

  it("uses every ingredient in at least one step", () => {
    for (const recipe of recipes) {
      const used = new Set(recipe.steps.flatMap((s) => s.uses ?? []))
      for (const ing of recipe.ingredients) {
        expect(
          used.has(ing.item),
          `${recipe.slug}: ingredient "${ing.item}" never appears in a step`
        ).toBe(true)
      }
    }
  })

  it("does not use an ingredient in more than one step", () => {
    for (const recipe of recipes) {
      const all = recipe.steps.flatMap((s) => s.uses ?? [])
      expect(
        new Set(all).size,
        `${recipe.slug}: an ingredient is added in two different steps`
      ).toBe(all.length)
    }
  })
})
