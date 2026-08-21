import { describe, it, expect, vi, afterEach } from "vitest"

vi.mock("content-collections", () => {
  const doc = (overrides: Record<string, unknown> & { slug: string }) => ({
    name: overrides.slug,
    course: "Mains",
    primary: "Chicken",
    tags: [],
    minutes: 30,
    servings: 2,
    publishedAt: "2020-01-01",
    image: `/assets/content/recipes/${overrides.slug}.jpg`,
    imageAlt: "",
    ingredients: [],
    steps: [],
    intro: "One-line intro.",
    ...overrides,
  })
  return {
    allRecipes: [
      doc({ slug: "pie-crust", course: "Basics", primary: "Flour" }),
      doc({ slug: "pot-pie-filling", course: "Basics", primary: "Chicken" }),
      doc({
        slug: "chicken-pot-pie",
        tags: ["Comfort Food"],
        components: ["pie-crust", "pot-pie-filling"],
      }),
      doc({ slug: "chicken-shawarma", tags: ["Comfort Food"] }),
      doc({ slug: "future-recipe", publishedAt: "2999-01-01" }),
      doc({ slug: "unscheduled", publishedAt: undefined }),
    ],
  }
})

const {
  getAllRecipes,
  getComponentRecipes,
  getRecipeBySlug,
  getRecipesUsing,
  getRelatedRecipes,
} = await import("./recipes")
const { validateRecipeSteps } = await import("./recipes-validation")

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("recipe loader", () => {
  it("maps frontmatter and the MDX body onto Recipe", () => {
    const recipe = getRecipeBySlug("chicken-pot-pie")
    expect(recipe).toMatchObject({
      slug: "chicken-pot-pie",
      course: "Mains",
      intro: "One-line intro.",
      components: ["pie-crust", "pot-pie-filling"],
      isDraft: false,
    })
  })

  it("keeps drafts visible outside production, flagged as drafts", () => {
    const bySlug = new Map(getAllRecipes().map((r) => [r.slug, r]))
    expect(bySlug.get("future-recipe")?.isDraft).toBe(true)
    expect(bySlug.get("unscheduled")?.isDraft).toBe(true)
    expect(bySlug.get("pie-crust")?.isDraft).toBe(false)
  })

  it("hides missing and future publishedAt in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    const slugs = getAllRecipes().map((r) => r.slug)
    expect(slugs).not.toContain("future-recipe")
    expect(slugs).not.toContain("unscheduled")
    expect(getRecipeBySlug("future-recipe")).toBeUndefined()
    expect(getRecipeBySlug("chicken-pot-pie")).toBeDefined()
  })
})

describe("component lookups", () => {
  it("resolves component recipes in declared order", () => {
    const potPie = getRecipeBySlug("chicken-pot-pie")!
    expect(getComponentRecipes(potPie).map((r) => r.slug)).toEqual([
      "pie-crust",
      "pot-pie-filling",
    ])
  })

  it("finds the recipes using a component via the reverse lookup", () => {
    expect(getRecipesUsing("pie-crust").map((r) => r.slug)).toEqual([
      "chicken-pot-pie",
    ])
    expect(getRecipesUsing("chicken-shawarma")).toEqual([])
  })
})

describe("getRelatedRecipes", () => {
  it("excludes component and used-in recipes, which get their own sections", () => {
    const potPie = getRecipeBySlug("chicken-pot-pie")!
    const related = getRelatedRecipes(potPie).map((r) => r.slug)
    expect(related).toContain("chicken-shawarma")
    expect(related).not.toContain("pie-crust")
    expect(related).not.toContain("pot-pie-filling")

    const crust = getRecipeBySlug("pie-crust")!
    expect(getRelatedRecipes(crust).map((r) => r.slug)).not.toContain(
      "chicken-pot-pie"
    )
  })
})

describe("validateRecipeSteps", () => {
  const ingredients = [{ item: "Butter" }, { item: "Flour" }]

  it("accepts each ingredient used exactly once", () => {
    expect(() =>
      validateRecipeSteps("ok", ingredients, [
        { text: "Cube.", uses: ["Butter"] },
        { text: "Mix.", uses: ["Flour"] },
      ])
    ).not.toThrow()
  })

  it("rejects a step using an unknown ingredient", () => {
    expect(() =>
      validateRecipeSteps("bad", ingredients, [
        { text: "Mix.", uses: ["Butter", "Flour", "Sugar"] },
      ])
    ).toThrow(/unknown ingredient "Sugar"/)
  })

  it("rejects an ingredient that never appears in a step", () => {
    expect(() =>
      validateRecipeSteps("bad", ingredients, [{ text: "Cube.", uses: ["Butter"] }])
    ).toThrow(/"Flour" never appears/)
  })

  it("rejects an ingredient added in two different steps", () => {
    expect(() =>
      validateRecipeSteps("bad", ingredients, [
        { text: "Cube.", uses: ["Butter", "Flour"] },
        { text: "Again.", uses: ["Butter"] },
      ])
    ).toThrow(/two different steps/)
  })
})
