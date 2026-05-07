import { describe, it, expect, vi, beforeEach } from "vitest"

import { validateFolioItems, type FolioItem } from "./folios"

const mockFolios: Array<{
  title: string
  excerpt: string
  publishedAt?: string
  updatedAt?: string
  coverImage?: string
  items: FolioItem[]
  slug: string
  content: string
  code: string
}> = []

vi.mock("content-collections", () => ({
  get allFolios() {
    return mockFolios
  },
}))

const { getAllFoliosForRender, isFolioDraft } = await import("./folios")

beforeEach(() => {
  mockFolios.length = 0
})

describe("validateFolioItems", () => {
  const posts = [
    { slug: "intro-to-claude", publishedAt: "2025-01-01" },
    { slug: "advanced-prompting", publishedAt: "2025-02-01" },
    { slug: "future-post", publishedAt: "2099-01-01" },
  ]
  const snippets = [
    { slug: "zod-validation", publishedAt: "2025-01-15" },
    { slug: "drizzle-query", publishedAt: "2025-03-01" },
  ]

  it("accepts a valid folio with articles and snippets", () => {
    const items: FolioItem[] = [
      { type: "article", slug: "intro-to-claude" },
      { type: "snippet", slug: "zod-validation" },
    ]
    expect(() =>
      validateFolioItems(items, "2025-06-01", posts, snippets)
    ).not.toThrow()
  })

  it("rejects a folio with fewer than two items", () => {
    const items: FolioItem[] = [{ type: "article", slug: "intro-to-claude" }]
    expect(() =>
      validateFolioItems(items, "2025-06-01", posts, snippets)
    ).toThrow(/at least 2 items/)
  })

  it("rejects a folio referencing a nonexistent article slug", () => {
    const items: FolioItem[] = [
      { type: "article", slug: "nonexistent-article" },
      { type: "snippet", slug: "zod-validation" },
    ]
    expect(() =>
      validateFolioItems(items, "2025-06-01", posts, snippets)
    ).toThrow(/does not exist/)
  })

  it("rejects a folio referencing a nonexistent snippet slug", () => {
    const items: FolioItem[] = [
      { type: "article", slug: "intro-to-claude" },
      { type: "snippet", slug: "nonexistent-snippet" },
    ]
    expect(() =>
      validateFolioItems(items, "2025-06-01", posts, snippets)
    ).toThrow(/does not exist/)
  })

  it("rejects a folio with duplicate (type, slug) pairs", () => {
    const items: FolioItem[] = [
      { type: "article", slug: "intro-to-claude" },
      { type: "snippet", slug: "zod-validation" },
      { type: "article", slug: "intro-to-claude" },
    ]
    expect(() =>
      validateFolioItems(items, "2025-06-01", posts, snippets)
    ).toThrow(/duplicate/)
  })

  it("rejects a folio whose item is future-dated relative to the folio publishedAt", () => {
    const items: FolioItem[] = [
      { type: "article", slug: "intro-to-claude" },
      { type: "article", slug: "future-post" },
    ]
    expect(() =>
      validateFolioItems(items, "2025-06-01", posts, snippets)
    ).toThrow(/future-dated/)
  })

  it("allows same slug with different types", () => {
    const postsWithSharedSlug = [
      ...posts,
      { slug: "zod-validation", publishedAt: "2025-01-15" },
    ]
    const items: FolioItem[] = [
      { type: "article", slug: "zod-validation" },
      { type: "snippet", slug: "zod-validation" },
    ]
    expect(() =>
      validateFolioItems(items, "2025-06-01", postsWithSharedSlug, snippets)
    ).not.toThrow()
  })

  it("skips date validation when folio has no publishedAt", () => {
    const items: FolioItem[] = [
      { type: "article", slug: "intro-to-claude" },
      { type: "article", slug: "future-post" },
    ]
    expect(() =>
      validateFolioItems(items, undefined, posts, snippets)
    ).not.toThrow()
  })
})

describe("isFolioDraft", () => {
  it("returns true when publishedAt is undefined", () => {
    expect(isFolioDraft({ publishedAt: undefined })).toBe(true)
  })

  it("returns true when publishedAt is in the future", () => {
    expect(isFolioDraft({ publishedAt: "2099-12-31" })).toBe(true)
  })

  it("returns false when publishedAt is in the past", () => {
    expect(isFolioDraft({ publishedAt: "2020-01-01" })).toBe(false)
  })

  it("returns true for an invalid date string", () => {
    expect(isFolioDraft({ publishedAt: "not-a-date" })).toBe(true)
  })
})

describe("getAllFoliosForRender", () => {
  const publishedFolio = {
    title: "Claude Code Journey",
    excerpt: "My progression through Claude Code features",
    publishedAt: "2025-03-01",
    items: [
      { type: "article" as const, slug: "intro-to-claude" },
      { type: "snippet" as const, slug: "zod-validation" },
    ],
    slug: "claude-code-journey",
    content: "# Preface\nThis is the preface.",
    code: "compiled-mdx",
  }

  const draftFolio = {
    title: "Future Folio",
    excerpt: "Not yet published",
    publishedAt: "2099-12-31",
    items: [
      { type: "article" as const, slug: "a" },
      { type: "snippet" as const, slug: "b" },
    ],
    slug: "future-folio",
    content: "",
    code: "",
  }

  const unpublishedFolio = {
    title: "Draft Folio",
    excerpt: "No publishedAt set",
    items: [
      { type: "article" as const, slug: "c" },
      { type: "snippet" as const, slug: "d" },
    ],
    slug: "draft-folio",
    content: "",
    code: "",
  }

  const olderFolio = {
    title: "Older Folio",
    excerpt: "An older published folio",
    publishedAt: "2025-01-15",
    items: [
      { type: "article" as const, slug: "e" },
      { type: "snippet" as const, slug: "f" },
    ],
    slug: "older-folio",
    content: "",
    code: "",
  }

  it("returns published folios sorted by publishedAt descending", () => {
    mockFolios.push(olderFolio, publishedFolio)
    const result = getAllFoliosForRender()
    expect(result.map((f) => f.slug)).toEqual([
      "claude-code-journey",
      "older-folio",
    ])
  })

  it("excludes future-dated folios in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    try {
      mockFolios.push(publishedFolio, draftFolio)
      const result = getAllFoliosForRender()
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe("claude-code-journey")
    } finally {
      vi.unstubAllEnvs()
    }
  })

  it("includes future-dated folios in development", () => {
    vi.stubEnv("NODE_ENV", "development")
    try {
      mockFolios.push(publishedFolio, draftFolio)
      const result = getAllFoliosForRender()
      expect(result).toHaveLength(2)
    } finally {
      vi.unstubAllEnvs()
    }
  })

  it("excludes folios without publishedAt in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    try {
      mockFolios.push(publishedFolio, unpublishedFolio)
      const result = getAllFoliosForRender()
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe("claude-code-journey")
    } finally {
      vi.unstubAllEnvs()
    }
  })

  it("enriches each folio with isDraft boolean", () => {
    mockFolios.push(publishedFolio, draftFolio)
    const result = getAllFoliosForRender()
    const published = result.find((f) => f.slug === "claude-code-journey")
    const draft = result.find((f) => f.slug === "future-folio")
    expect(published?.isDraft).toBe(false)
    expect(draft?.isDraft).toBe(true)
  })
})
