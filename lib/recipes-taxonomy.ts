// Shared recipe vocabulary. Lives outside lib/recipes.ts so that
// content-collections.ts can build its schema from it without importing the
// generated collections (lib/recipes.ts imports "content-collections", which
// does not exist yet while the collection config itself is being compiled).

export const COURSES = [
  "Breakfast",
  "Mains",
  "Sides",
  "Dessert",
  "Snacks",
  "Basics",
] as const

export type Course = (typeof COURSES)[number]

export const RECIPE_TAGS = [
  "Healthy",
  "Light Lunch",
  "Weekday",
  "Weekend",
  "Guests",
  "Meal Prep",
  "Freezer-Friendly",
  "Vacuum Seal",
  "Quick",
  "Make Ahead",
  "High Protein",
  "Comfort Food",
  "Special Occasion",
] as const

export type RecipeTag = (typeof RECIPE_TAGS)[number]

export type Ingredient = {
  item: string
  grams?: number
  note?: string
}

export type Step = {
  text: string
  // Ingredient `item` names added at this step, for the consolidated view.
  uses?: string[]
}
