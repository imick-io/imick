import { describe, it, expect, vi, beforeEach } from "vitest"

const mockGetRecentlyReviewedBookmarks = vi.fn()

vi.mock("./bookmarks", () => ({
  getRecentlyReviewedBookmarks: mockGetRecentlyReviewedBookmarks,
}))

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
