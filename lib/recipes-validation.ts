import type { Ingredient, Step } from "./recipes-taxonomy"

// Integrity checks for recipe MDX, run from the content-collections transform
// so a bad recipe fails the build instead of rendering broken.
export function validateRecipeSteps(
  slug: string,
  ingredients: Ingredient[],
  steps: Step[]
): void {
  const items = new Set(ingredients.map((ing) => ing.item))
  const used = new Set<string>()
  for (const step of steps) {
    for (const item of step.uses ?? []) {
      if (!items.has(item)) {
        throw new Error(`${slug}: step references unknown ingredient "${item}"`)
      }
      if (used.has(item)) {
        throw new Error(`${slug}: ingredient "${item}" is added in two different steps`)
      }
      used.add(item)
    }
  }
  for (const ing of ingredients) {
    if (!used.has(ing.item)) {
      throw new Error(`${slug}: ingredient "${ing.item}" never appears in a step`)
    }
  }
}
