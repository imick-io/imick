import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, it, expect, vi, beforeEach } from "vitest"

const mockGetRecentlyReviewedBookmarks = vi.fn()

vi.mock("./bookmarks", () => ({
  getRecentlyReviewedBookmarks: mockGetRecentlyReviewedBookmarks,
}))

// The collection is mocked so the wiring can be tested without generated
// content; a separate test checks the curated slugs against content/recipes.
vi.mock("content-collections", () => {
  const doc = (slug: string) => ({
    slug,
    name: slug,
    intro: "",
    course: "Mains",
    primary: "Chicken",
    tags: [],
    minutes: 30,
    servings: 2,
    publishedAt: "2020-01-01",
    image: `/assets/content/recipes/${slug}.jpg`,
    imageAlt: "",
    ingredients: [],
    steps: [],
  })
  return {
    allRecipes: [
      "greek-smash-burger",
      "spaghetti-with-meat-sauce",
      "chocolate-fondant",
      "classic-waffles",
      "tzatziki",
    ].map(doc),
  }
})

const { FEATURED_RECIPE_SLUGS, getFeaturedRecipes, getHomeBookmarks } =
  await import("./home-content")

beforeEach(() => {
  mockGetRecentlyReviewedBookmarks.mockReset()
})

describe("getFeaturedRecipes", () => {
  it("returns one recipe per curated slug, in order", () => {
    const recipes = getFeaturedRecipes()

    expect(recipes.map((r) => r.slug)).toEqual([...FEATURED_RECIPE_SLUGS])
  })

  it("returns recipes with the fields the cooking tile renders", () => {
    for (const recipe of getFeaturedRecipes()) {
      expect(recipe.slug.length).toBeGreaterThan(0)
      expect(recipe.name.length).toBeGreaterThan(0)
    }
  })

  it("curates slugs that exist in content/recipes", () => {
    for (const slug of FEATURED_RECIPE_SLUGS) {
      expect(
        existsSync(join(process.cwd(), "content", "recipes", `${slug}.mdx`)),
        `content/recipes/${slug}.mdx is missing`
      ).toBe(true)
    }
  })
})

describe("getHomeBookmarks", () => {
  it("returns bookmarks from getRecentlyReviewedBookmarks", async () => {
    const rows = [{ id: "1", title: "Raycast" }]
    mockGetRecentlyReviewedBookmarks.mockResolvedValue(rows)

    await expect(getHomeBookmarks(3)).resolves.toEqual(rows)
    expect(mockGetRecentlyReviewedBookmarks).toHaveBeenCalledWith(3)
  })

  it("returns an empty array when the query rejects", async () => {
    mockGetRecentlyReviewedBookmarks.mockRejectedValue(new Error("db down"))

    await expect(getHomeBookmarks()).resolves.toEqual([])
  })
})
