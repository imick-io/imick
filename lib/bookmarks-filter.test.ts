import { describe, it, expect } from "vitest"
import { filterBookmarks, buildTagMap, type BookmarkFilters } from "./bookmarks-filter"
import type { Bookmark } from "./db/schema"

function makeBookmark(overrides: Partial<Bookmark> & { id: string }): Bookmark {
  return {
    url: "https://example.com",
    slug: overrides.id,
    title: overrides.id,
    description: null,
    logoUrl: null,
    imageUrl: null,
    colorHex: null,
    category: null,
    tags: [],
    pros: [],
    cons: [],
    aiSummary: null,
    rating: null,
    reviewText: null,
    publishedAt: new Date("2025-01-01"),
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    ...overrides,
  }
}

const fixtures = [
  makeBookmark({
    id: "a",
    title: "Alpha Tool",
    description: "A great CLI tool",
    url: "https://alpha.dev",
    category: "tools",
    tags: ["cli", "node"],
    rating: 5,
    reviewText: "Excellent",
    createdAt: new Date("2025-01-04"),
    updatedAt: new Date("2025-01-04"),
  }),
  makeBookmark({
    id: "b",
    title: "Beta Library",
    description: "React component library",
    url: "https://beta.io",
    category: "tools",
    tags: ["react", "node"],
    rating: 3,
    reviewText: "Decent",
    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-03"),
  }),
  makeBookmark({
    id: "c",
    title: "Gamma Design",
    description: "Figma plugin for design systems",
    url: "https://gamma.design",
    category: "design",
    tags: ["figma", "ui"],
    rating: 4,
    reviewText: "Good",
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-02"),
  }),
  makeBookmark({
    id: "d",
    title: "Delta Resource",
    description: null,
    url: "https://delta.org",
    category: "tools",
    tags: ["cli"],
    rating: null,
    reviewText: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  }),
]

const empty: BookmarkFilters = {}

describe("filterBookmarks", () => {
  describe("tags filter", () => {
    it("returns all bookmarks when tags is empty", () => {
      const result = filterBookmarks(fixtures, { tags: [] })
      expect(result.map((b) => b.id)).toEqual(["a", "b", "c", "d"])
    })

    it("returns all bookmarks when tags is undefined", () => {
      const result = filterBookmarks(fixtures, empty)
      expect(result.map((b) => b.id)).toEqual(["a", "b", "c", "d"])
    })

    it("filters to bookmarks matching a single tag", () => {
      const result = filterBookmarks(fixtures, { tags: ["cli"] })
      expect(result.map((b) => b.id)).toEqual(["a", "d"])
    })

    it("applies AND semantics for multiple tags", () => {
      const result = filterBookmarks(fixtures, { tags: ["cli", "node"] })
      expect(result.map((b) => b.id)).toEqual(["a"])
    })

    it("returns empty when no bookmarks match all tags", () => {
      const result = filterBookmarks(fixtures, { tags: ["cli", "react"] })
      expect(result).toEqual([])
    })

    it("combines tags with category filter", () => {
      const result = filterBookmarks(fixtures, {
        category: "tools",
        tags: ["node"],
      })
      expect(result.map((b) => b.id)).toEqual(["a", "b"])
    })

    it("combines tags with category and q filter", () => {
      const result = filterBookmarks(fixtures, {
        category: "tools",
        tags: ["node"],
        q: "alpha",
      })
      expect(result.map((b) => b.id)).toEqual(["a"])
    })
  })

  describe("buildTagMap", () => {
    it("groups tags by category and includes a global entry", () => {
      const map = buildTagMap(fixtures)
      expect(map[""]).toEqual(["cli", "figma", "node", "react", "ui"])
      expect(map["tools"]).toEqual(["cli", "node", "react"])
      expect(map["design"]).toEqual(["figma", "ui"])
    })

    it("returns empty global entry for bookmarks with no tags", () => {
      const map = buildTagMap([makeBookmark({ id: "x", category: "misc", tags: [] })])
      expect(map[""]).toEqual([])
    })
  })

  describe("default sort", () => {
    it("returns bookmarks sorted newest first by default", () => {
      const result = filterBookmarks(fixtures, empty)
      expect(result.map((b) => b.id)).toEqual(["a", "b", "c", "d"])
    })
  })

  describe("category filter", () => {
    it("narrows to the given category", () => {
      const result = filterBookmarks(fixtures, { category: "tools" })
      expect(result.map((b) => b.id)).toEqual(["a", "b", "d"])
    })

    it("returns empty for unknown category", () => {
      const result = filterBookmarks(fixtures, { category: "unknown" })
      expect(result).toEqual([])
    })
  })
})
