import { describe, it, expect } from "vitest"
import { filterBookmarks, buildTagMap, hasActiveNarrowingFilters, type BookmarkFilters } from "./bookmarks-filter"
import type { Bookmark } from "./db/schema"

function makeBookmark(overrides: Partial<Bookmark> & { id: string }): Bookmark {
  return {
    url: `https://${overrides.id}.example.com`,
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

function ids(result: Bookmark[]): string[] {
  return result.map((b) => b.id)
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

const reviewFixtures = [reviewed1, reviewed2, reviewed3, unreviewed1, unreviewed2]

const empty: BookmarkFilters = {}

describe("filterBookmarks", () => {
  describe("tags filter", () => {
    it("returns all bookmarks when tags is empty", () => {
      const result = filterBookmarks(fixtures, { tags: [] })
      expect(ids(result)).toEqual(["a", "b", "c", "d"])
    })

    it("returns all bookmarks when tags is undefined", () => {
      const result = filterBookmarks(fixtures, empty)
      expect(ids(result)).toEqual(["a", "b", "c", "d"])
    })

    it("filters to bookmarks matching a single tag", () => {
      const result = filterBookmarks(fixtures, { tags: ["cli"] })
      expect(ids(result)).toEqual(["a", "d"])
    })

    it("applies AND semantics for multiple tags", () => {
      const result = filterBookmarks(fixtures, { tags: ["cli", "node"] })
      expect(ids(result)).toEqual(["a"])
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
      expect(ids(result)).toEqual(["a", "b"])
    })

    it("combines tags with category and q filter", () => {
      const result = filterBookmarks(fixtures, {
        category: "tools",
        tags: ["node"],
        q: "alpha",
      })
      expect(ids(result)).toEqual(["a"])
    })
  })

  describe("default sort", () => {
    it("returns bookmarks sorted newest first by default", () => {
      const result = filterBookmarks(fixtures, empty)
      expect(ids(result)).toEqual(["a", "b", "c", "d"])
    })
  })

  describe("category filter", () => {
    it("narrows to the given category", () => {
      const result = filterBookmarks(fixtures, { category: "tools" })
      expect(ids(result)).toEqual(["a", "b", "d"])
    })

    it("returns empty for unknown category", () => {
      const result = filterBookmarks(fixtures, { category: "unknown" })
      expect(result).toEqual([])
    })
  })

  describe("reviewed filter", () => {
    it("returns all bookmarks when reviewed is 'all'", () => {
      const result = filterBookmarks(reviewFixtures, { reviewed: "all" })
      expect(ids(result)).toEqual(["u1", "r1", "r2", "r3", "u2"])
    })

    it("returns all bookmarks when reviewed is undefined (default)", () => {
      const result = filterBookmarks(reviewFixtures, empty)
      expect(ids(result)).toEqual(["u1", "r1", "r2", "r3", "u2"])
    })

    it("returns only reviewed bookmarks when reviewed is 'yes'", () => {
      const result = filterBookmarks(reviewFixtures, { reviewed: "yes" })
      expect(ids(result)).toEqual(["r1", "r2", "r3"])
    })

    it("returns only unreviewed bookmarks when reviewed is 'no'", () => {
      const result = filterBookmarks(reviewFixtures, { reviewed: "no" })
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

  describe("search filter (q)", () => {
    it("matches title case-insensitively", () => {
      const result = filterBookmarks(reviewFixtures, { q: "reviewed tool" })
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
      const result = filterBookmarks(reviewFixtures, { q: "r1.example" })
      expect(ids(result)).toEqual(["r1"])
    })

    it("trims whitespace", () => {
      const result = filterBookmarks(reviewFixtures, { q: "  reviewed tool  " })
      expect(ids(result)).toEqual(["r1"])
    })

    it("returns all when q is empty string", () => {
      const result = filterBookmarks(reviewFixtures, { q: "" })
      expect(ids(result)).toEqual(["u1", "r1", "r2", "r3", "u2"])
    })

    it("returns all when q is only whitespace", () => {
      const result = filterBookmarks(reviewFixtures, { q: "   " })
      expect(ids(result)).toEqual(["u1", "r1", "r2", "r3", "u2"])
    })
  })

  describe("sort filter", () => {
    it("sorts newest first by default (no sort specified)", () => {
      const result = filterBookmarks(fixtures, empty)
      expect(ids(result)).toEqual(["a", "b", "c", "d"])
    })

    it("sorts newest first when sort is 'newest'", () => {
      const result = filterBookmarks(fixtures, { sort: "newest" })
      expect(ids(result)).toEqual(["a", "b", "c", "d"])
    })

    it("sorts by rating desc when sort is 'top-rated'", () => {
      const result = filterBookmarks(fixtures, { sort: "top-rated" })
      expect(ids(result)).toEqual(["a", "c", "b"])
    })

    it("breaks rating ties by updatedAt desc", () => {
      const tied1 = makeBookmark({
        id: "t1",
        rating: 4,
        reviewText: "Good",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-06-01"),
      })
      const tied2 = makeBookmark({
        id: "t2",
        rating: 4,
        reviewText: "Also good",
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-05-01"),
      })
      const result = filterBookmarks([tied1, tied2], { sort: "top-rated" })
      expect(ids(result)).toEqual(["t1", "t2"])
    })

    it("drops unreviewed bookmarks when sort is 'top-rated'", () => {
      const result = filterBookmarks(reviewFixtures, { sort: "top-rated" })
      expect(ids(result)).not.toContain("u1")
      expect(ids(result)).not.toContain("u2")
    })

    it("keeps all bookmarks (including unreviewed) when sort is 'newest'", () => {
      const result = filterBookmarks(reviewFixtures, { sort: "newest" })
      expect(ids(result)).toContain("u1")
      expect(ids(result)).toContain("u2")
    })

    it("top-rated orders reviewed bookmarks by rating desc then updatedAt desc", () => {
      const result = filterBookmarks(reviewFixtures, { sort: "top-rated" })
      expect(ids(result)).toEqual(["r1", "r2", "r3"])
    })

    it("top-rated treats null rating as 0 for ordering", () => {
      const withRating = makeBookmark({
        id: "wr",
        rating: 1,
        reviewText: "Low rating",
        updatedAt: new Date("2025-01-01"),
      })
      const noRating = makeBookmark({
        id: "nr",
        rating: null,
        reviewText: "Has review text but no rating",
        updatedAt: new Date("2025-06-01"),
      })
      const result = filterBookmarks([withRating, noRating], { sort: "top-rated" })
      expect(ids(result)).toEqual(["wr", "nr"])
    })
  })

  describe("sort combined with other filters", () => {
    it("top-rated + category narrows and sorts", () => {
      const result = filterBookmarks(reviewFixtures, {
        category: "dev-tools",
        sort: "top-rated",
      })
      expect(ids(result)).toEqual(["r1", "r3"])
    })

    it("top-rated + tags narrows and sorts", () => {
      const result = filterBookmarks(reviewFixtures, {
        tags: ["typescript"],
        sort: "top-rated",
      })
      expect(ids(result)).toEqual(["r1", "r3"])
    })

    it("top-rated + search narrows and sorts", () => {
      const result = filterBookmarks(reviewFixtures, {
        q: "reviewed",
        sort: "top-rated",
      })
      expect(ids(result)).toEqual(["r1", "r2"])
    })

    it("top-rated + reviewed=yes is redundant but consistent", () => {
      const result = filterBookmarks(reviewFixtures, {
        reviewed: "yes",
        sort: "top-rated",
      })
      expect(ids(result)).toEqual(["r1", "r2", "r3"])
    })

    it("top-rated + reviewed=no returns empty (all unreviewed dropped)", () => {
      const result = filterBookmarks(reviewFixtures, {
        reviewed: "no",
        sort: "top-rated",
      })
      expect(result).toEqual([])
    })

    it("top-rated + category + tags + q combined", () => {
      const result = filterBookmarks(reviewFixtures, {
        category: "dev-tools",
        tags: ["typescript"],
        q: "review only",
        sort: "top-rated",
      })
      expect(ids(result)).toEqual(["r3"])
    })

    it("newest + category preserves createdAt order", () => {
      const result = filterBookmarks(reviewFixtures, {
        category: "dev-tools",
        sort: "newest",
      })
      expect(ids(result)).toEqual(["u1", "r1", "r3"])
    })
  })

  describe("combined filters", () => {
    it("category + reviewed yes", () => {
      const result = filterBookmarks(reviewFixtures, {
        category: "dev-tools",
        reviewed: "yes",
      })
      expect(ids(result)).toEqual(["r1", "r3"])
    })

    it("category + reviewed no", () => {
      const result = filterBookmarks(reviewFixtures, {
        category: "dev-tools",
        reviewed: "no",
      })
      expect(ids(result)).toEqual(["u1"])
    })

    it("category + tags + reviewed", () => {
      const result = filterBookmarks(reviewFixtures, {
        category: "dev-tools",
        tags: ["typescript"],
        reviewed: "yes",
      })
      expect(ids(result)).toEqual(["r1", "r3"])
    })

    it("search + reviewed yes", () => {
      const result = filterBookmarks(reviewFixtures, {
        q: "another",
        reviewed: "yes",
      })
      expect(ids(result)).toEqual(["r2"])
    })

    it("search + reviewed no", () => {
      const result = filterBookmarks(reviewFixtures, {
        q: "another",
        reviewed: "no",
      })
      expect(ids(result)).toEqual(["u2"])
    })

    it("all filters combined", () => {
      const result = filterBookmarks(reviewFixtures, {
        category: "dev-tools",
        tags: ["typescript"],
        q: "review only",
        reviewed: "yes",
      })
      expect(ids(result)).toEqual(["r3"])
    })
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

describe("hasActiveNarrowingFilters", () => {
  it("returns false when all filters are default", () => {
    expect(hasActiveNarrowingFilters({})).toBe(false)
  })

  it("returns false for explicit defaults", () => {
    expect(
      hasActiveNarrowingFilters({ q: "", tags: [], reviewed: "all", sort: "newest" })
    ).toBe(false)
  })

  it("returns true when q is set", () => {
    expect(hasActiveNarrowingFilters({ q: "react" })).toBe(true)
  })

  it("returns false when q is only whitespace", () => {
    expect(hasActiveNarrowingFilters({ q: "   " })).toBe(false)
  })

  it("returns true when tags has entries", () => {
    expect(hasActiveNarrowingFilters({ tags: ["cli"] })).toBe(true)
  })

  it("returns true when reviewed is not all", () => {
    expect(hasActiveNarrowingFilters({ reviewed: "yes" })).toBe(true)
    expect(hasActiveNarrowingFilters({ reviewed: "no" })).toBe(true)
  })

  it("returns true when sort is not newest", () => {
    expect(hasActiveNarrowingFilters({ sort: "top-rated" })).toBe(true)
  })

  it("ignores category (category is path-driven)", () => {
    expect(hasActiveNarrowingFilters({ category: "tools" })).toBe(false)
  })

  it("returns true when multiple narrowing filters are active", () => {
    expect(
      hasActiveNarrowingFilters({ q: "test", tags: ["cli"], reviewed: "yes", sort: "top-rated" })
    ).toBe(true)
  })
})
