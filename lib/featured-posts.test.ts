import { describe, it, expect, vi, beforeEach } from "vitest"

type MockPost = {
  slug: string
  title: string
  publishedAt?: string
}

const mockPosts: MockPost[] = []
const mockFeaturedSlugs: string[] = []

vi.mock("content-collections", () => ({
  get allPosts() {
    return mockPosts
  },
}))

vi.mock("./config", () => ({
  get siteConfig() {
    return { featuredPostSlugs: mockFeaturedSlugs }
  },
}))

const { getFeaturedPosts } = await import("./featured-posts")

beforeEach(() => {
  mockPosts.length = 0
  mockFeaturedSlugs.length = 0
})

describe("getFeaturedPosts", () => {
  it("returns posts in declared order, not publishedAt order", () => {
    mockPosts.push(
      { slug: "a", title: "A", publishedAt: "2025-01-01" },
      { slug: "b", title: "B", publishedAt: "2026-01-01" },
      { slug: "c", title: "C", publishedAt: "2024-01-01" },
    )
    mockFeaturedSlugs.push("a", "b", "c")

    const result = getFeaturedPosts()

    expect(result.map((p) => p.slug)).toEqual(["a", "b", "c"])
  })

  it("silently filters slugs that do not match any post", () => {
    mockPosts.push(
      { slug: "a", title: "A", publishedAt: "2025-01-01" },
      { slug: "c", title: "C", publishedAt: "2025-02-01" },
    )
    mockFeaturedSlugs.push("a", "missing-slug", "c")

    expect(() => getFeaturedPosts()).not.toThrow()
    const result = getFeaturedPosts()
    expect(result.map((p) => p.slug)).toEqual(["a", "c"])
  })

  it("warns once per missing slug in development", () => {
    vi.stubEnv("NODE_ENV", "development")
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    try {
      mockPosts.push({ slug: "a", title: "A", publishedAt: "2025-01-01" })
      mockFeaturedSlugs.push("a", "missing-one", "missing-two")

      getFeaturedPosts()

      expect(warnSpy).toHaveBeenCalledTimes(2)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("missing-one"),
      )
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("missing-two"),
      )
    } finally {
      warnSpy.mockRestore()
      vi.unstubAllEnvs()
    }
  })

  it("does not warn in production when slugs are missing", () => {
    vi.stubEnv("NODE_ENV", "production")
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    try {
      mockPosts.push({ slug: "a", title: "A", publishedAt: "2025-01-01" })
      mockFeaturedSlugs.push("a", "missing-one", "missing-two")

      getFeaturedPosts()

      expect(warnSpy).not.toHaveBeenCalled()
    } finally {
      warnSpy.mockRestore()
      vi.unstubAllEnvs()
    }
  })

  it("respects an explicit limit smaller than the slug list length", () => {
    mockPosts.push(
      { slug: "a", title: "A", publishedAt: "2025-01-01" },
      { slug: "b", title: "B", publishedAt: "2025-02-01" },
      { slug: "c", title: "C", publishedAt: "2025-03-01" },
    )
    mockFeaturedSlugs.push("a", "b", "c")

    const result = getFeaturedPosts(2)

    expect(result.map((p) => p.slug)).toEqual(["a", "b"])
  })

  it("returns an empty array when the slug list is empty", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    try {
      mockPosts.push({ slug: "a", title: "A", publishedAt: "2025-01-01" })

      const result = getFeaturedPosts()

      expect(result).toEqual([])
      expect(warnSpy).not.toHaveBeenCalled()
    } finally {
      warnSpy.mockRestore()
    }
  })
})
