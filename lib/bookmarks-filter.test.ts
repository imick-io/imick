import { describe, it, expect } from "vitest"
import { filterBookmarks, type BookmarkFilters } from "./bookmarks-filter"
import type { Bookmark } from "./db/schema"

function makeBookmark(overrides: Partial<Bookmark> & { id: string }): Bookmark {
  return {
    id: overrides.id,
    url: overrides.url ?? `https://${overrides.id}.example.com`,
    slug: overrides.slug ?? overrides.id,
    title: overrides.title ?? overrides.id,
    description: overrides.description ?? null,
    logoUrl: overrides.logoUrl ?? null,
    imageUrl: overrides.imageUrl ?? null,
    colorHex: overrides.colorHex ?? null,
    category: overrides.category ?? "dev-tools",
    tags: overrides.tags ?? [],
    pros: overrides.pros ?? [],
    cons: overrides.cons ?? [],
    aiSummary: overrides.aiSummary ?? null,
    rating: overrides.rating ?? null,
    reviewText: overrides.reviewText ?? null,
    publishedAt: overrides.publishedAt ?? new Date("2025-01-01"),
    createdAt: overrides.createdAt ?? new Date("2025-01-01"),
    updatedAt: overrides.updatedAt ?? new Date("2025-01-01"),
  }
}

const reviewed1 = makeBookmark({
  id: "r1",
  title: "Reviewed Tool",
  rating: 5,
  reviewText: "Great tool",
  category: "dev-tools",
  tags: ["typescript", "react"],
  createdAt: new Date("2025-03-01"),
  updatedAt: new Date("2025-03-15"),
})

const reviewed2 = makeBookmark({
  id: "r2",
  title: "Another Reviewed",
  rating: 3,
  reviewText: null,
  category: "design",
  tags: ["css"],
  createdAt: new Date("2025-02-01"),
  updatedAt: new Date("2025-02-10"),
})

const reviewed3 = makeBookmark({
  id: "r3",
  title: "Review Only",
  rating: null,
  reviewText: "Decent library",
  category: "dev-tools",
  tags: ["typescript"],
  createdAt: new Date("2025-01-15"),
  updatedAt: new Date("2025-01-20"),
})

const unreviewed1 = makeBookmark({
  id: "u1",
  title: "Unreviewed Bookmark",
  rating: null,
  reviewText: null,
  category: "dev-tools",
  tags: ["react"],
  createdAt: new Date("2025-04-01"),
  updatedAt: new Date("2025-04-01"),
})

const unreviewed2 = makeBookmark({
  id: "u2",
  title: "Another Unreviewed",
  rating: null,
  reviewText: null,
  category: "design",
  tags: ["figma"],
  createdAt: new Date("2025-01-10"),
  updatedAt: new Date("2025-01-10"),
})

const all = [reviewed1, reviewed2, reviewed3, unreviewed1, unreviewed2]

const noFilters: BookmarkFilters = {}

function ids(result: Bookmark[]): string[] {
  return result.map((b) => b.id)
}

describe("filterBookmarks", () => {
  describe("reviewed filter", () => {
    it("returns all bookmarks when reviewed is 'all'", () => {
      const result = filterBookmarks(all, { reviewed: "all" })
      expect(ids(result)).toEqual(ids(all))
    })

    it("returns all bookmarks when reviewed is undefined (default)", () => {
      const result = filterBookmarks(all, noFilters)
      expect(ids(result)).toEqual(ids(all))
    })

    it("returns only reviewed bookmarks when reviewed is 'yes'", () => {
      const result = filterBookmarks(all, { reviewed: "yes" })
      expect(ids(result)).toEqual(["r1", "r2", "r3"])
    })

    it("returns only unreviewed bookmarks when reviewed is 'no'", () => {
      const result = filterBookmarks(all, { reviewed: "no" })
      expect(ids(result)).toEqual(["u1", "u2"])
    })

    it("treats rating-only as reviewed", () => {
      const result = filterBookmarks([reviewed2], { reviewed: "yes" })
      expect(ids(result)).toEqual(["r2"])
    })

    it("treats reviewText-only as reviewed", () => {
      const result = filterBookmarks([reviewed3], { reviewed: "yes" })
      expect(ids(result)).toEqual(["r3"])
    })
  })

  describe("category filter", () => {
    it("filters to a single category", () => {
      const result = filterBookmarks(all, { category: "dev-tools" })
      expect(ids(result)).toEqual(["r1", "r3", "u1"])
    })

    it("returns nothing for unknown category", () => {
      const result = filterBookmarks(all, { category: "unknown" })
      expect(result).toHaveLength(0)
    })
  })

  describe("search filter (q)", () => {
    it("matches title case-insensitively", () => {
      const result = filterBookmarks(all, { q: "reviewed tool" })
      expect(ids(result)).toEqual(["r1"])
    })

    it("matches description", () => {
      const b = makeBookmark({
        id: "desc-match",
        description: "A fantastic CSS framework",
      })
      const result = filterBookmarks([b], { q: "css framework" })
      expect(ids(result)).toEqual(["desc-match"])
    })

    it("matches hostname", () => {
      const result = filterBookmarks(all, { q: "r1.example" })
      expect(ids(result)).toEqual(["r1"])
    })

    it("trims whitespace", () => {
      const result = filterBookmarks(all, { q: "  reviewed tool  " })
      expect(ids(result)).toEqual(["r1"])
    })

    it("returns all when q is empty string", () => {
      const result = filterBookmarks(all, { q: "" })
      expect(ids(result)).toEqual(ids(all))
    })

    it("returns all when q is only whitespace", () => {
      const result = filterBookmarks(all, { q: "   " })
      expect(ids(result)).toEqual(ids(all))
    })
  })

  describe("tags filter", () => {
    it("filters by single tag", () => {
      const result = filterBookmarks(all, { tags: ["typescript"] })
      expect(ids(result)).toEqual(["r1", "r3"])
    })

    it("applies AND semantics for multiple tags", () => {
      const result = filterBookmarks(all, { tags: ["typescript", "react"] })
      expect(ids(result)).toEqual(["r1"])
    })

    it("returns nothing when no bookmark matches all tags", () => {
      const result = filterBookmarks(all, { tags: ["typescript", "figma"] })
      expect(result).toHaveLength(0)
    })
  })

  describe("combined filters", () => {
    it("category + reviewed yes", () => {
      const result = filterBookmarks(all, {
        category: "dev-tools",
        reviewed: "yes",
      })
      expect(ids(result)).toEqual(["r1", "r3"])
    })

    it("category + reviewed no", () => {
      const result = filterBookmarks(all, {
        category: "dev-tools",
        reviewed: "no",
      })
      expect(ids(result)).toEqual(["u1"])
    })

    it("category + tags + reviewed", () => {
      const result = filterBookmarks(all, {
        category: "dev-tools",
        tags: ["typescript"],
        reviewed: "yes",
      })
      expect(ids(result)).toEqual(["r1", "r3"])
    })

    it("search + reviewed yes", () => {
      const result = filterBookmarks(all, {
        q: "another",
        reviewed: "yes",
      })
      expect(ids(result)).toEqual(["r2"])
    })

    it("search + reviewed no", () => {
      const result = filterBookmarks(all, {
        q: "another",
        reviewed: "no",
      })
      expect(ids(result)).toEqual(["u2"])
    })

    it("all filters combined", () => {
      const result = filterBookmarks(all, {
        category: "dev-tools",
        tags: ["typescript"],
        q: "review only",
        reviewed: "yes",
      })
      expect(ids(result)).toEqual(["r3"])
    })
  })
})
