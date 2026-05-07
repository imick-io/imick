import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const mockAllClasses = vi.hoisted(() => ({ value: [] as Array<Record<string, unknown>> }))

vi.mock("content-collections", () => ({
  get allClasses() {
    return mockAllClasses.value
  },
}))

import {
  isDraft,
  isComingSoon,
  isPublished,
  getAllClassesForRender,
  getClassBySlug,
  formatComingSoonDate,
  formatClassDate,
} from "./classes"

function makeClass(overrides: Record<string, unknown> = {}) {
  return {
    title: "Test Class",
    tagline: "A test tagline",
    publishedAt: "2024-01-15",
    tags: [],
    _meta: { fileName: "test-class.mdx", filePath: "test-class.mdx", directory: ".", path: "test-class", extension: "mdx" },
    slug: "test-class",
    sourcePath: "content/classes/test-class.mdx",
    content: "",
    code: "",
    ...overrides,
  }
}

const PAST_DATE = "2020-06-01"
const FUTURE_DATE = "2099-12-01"

describe("isDraft", () => {
  it("returns true when publishedAt is missing", () => {
    expect(isDraft(makeClass({ publishedAt: undefined }))).toBe(true)
  })

  it("returns true when publishedAt is empty string", () => {
    expect(isDraft(makeClass({ publishedAt: "" }))).toBe(true)
  })

  it("returns true when publishedAt is an invalid date string", () => {
    expect(isDraft(makeClass({ publishedAt: "not-a-date" }))).toBe(true)
  })

  it("returns false for a valid past date", () => {
    expect(isDraft(makeClass({ publishedAt: PAST_DATE }))).toBe(false)
  })

  it("returns false for a valid future date", () => {
    expect(isDraft(makeClass({ publishedAt: FUTURE_DATE }))).toBe(false)
  })
})

describe("isComingSoon", () => {
  it("returns true for a future publishedAt", () => {
    expect(isComingSoon(makeClass({ publishedAt: FUTURE_DATE }))).toBe(true)
  })

  it("returns false for a past publishedAt", () => {
    expect(isComingSoon(makeClass({ publishedAt: PAST_DATE }))).toBe(false)
  })

  it("returns false for a draft (missing publishedAt)", () => {
    expect(isComingSoon(makeClass({ publishedAt: undefined }))).toBe(false)
  })

  it("returns false for a draft (invalid publishedAt)", () => {
    expect(isComingSoon(makeClass({ publishedAt: "garbage" }))).toBe(false)
  })
})

describe("isPublished", () => {
  it("returns true for a past publishedAt", () => {
    expect(isPublished(makeClass({ publishedAt: PAST_DATE }))).toBe(true)
  })

  it("returns false for a future publishedAt", () => {
    expect(isPublished(makeClass({ publishedAt: FUTURE_DATE }))).toBe(false)
  })

  it("returns false for missing publishedAt", () => {
    expect(isPublished(makeClass({ publishedAt: undefined }))).toBe(false)
  })

  it("returns false for invalid publishedAt", () => {
    expect(isPublished(makeClass({ publishedAt: "invalid" }))).toBe(false)
  })
})

describe("getAllClassesForRender", () => {
  beforeEach(() => {
    mockAllClasses.value = []
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("returns an empty array when no classes exist", () => {
    expect(getAllClassesForRender()).toEqual([])
  })

  it("includes published classes", () => {
    mockAllClasses.value = [makeClass({ publishedAt: PAST_DATE, slug: "published" })]
    const result = getAllClassesForRender()
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe("published")
  })

  it("includes coming-soon classes", () => {
    mockAllClasses.value = [makeClass({ publishedAt: FUTURE_DATE, slug: "coming" })]
    const result = getAllClassesForRender()
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe("coming")
  })

  it("hides drafts in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    mockAllClasses.value = [makeClass({ publishedAt: undefined, slug: "draft" })]
    expect(getAllClassesForRender()).toHaveLength(0)
  })

  it("shows drafts in development", () => {
    vi.stubEnv("NODE_ENV", "development")
    mockAllClasses.value = [makeClass({ publishedAt: undefined, slug: "draft" })]
    const result = getAllClassesForRender()
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe("draft")
  })

  it("sorts by publishedAt ascending (soonest first)", () => {
    mockAllClasses.value = [
      makeClass({ publishedAt: "2099-12-01", slug: "later" }),
      makeClass({ publishedAt: "2099-06-01", slug: "sooner" }),
      makeClass({ publishedAt: "2020-01-01", slug: "published" }),
    ]
    const slugs = getAllClassesForRender().map((c) => c.slug)
    expect(slugs).toEqual(["published", "sooner", "later"])
  })

  it("places classes without publishedAt (drafts) at the beginning", () => {
    vi.stubEnv("NODE_ENV", "development")
    mockAllClasses.value = [
      makeClass({ publishedAt: "2099-06-01", slug: "coming" }),
      makeClass({ publishedAt: undefined, slug: "draft" }),
    ]
    const slugs = getAllClassesForRender().map((c) => c.slug)
    expect(slugs).toEqual(["draft", "coming"])
  })

  it("enriches each class with lifecycle state", () => {
    mockAllClasses.value = [
      makeClass({ publishedAt: PAST_DATE, slug: "pub" }),
      makeClass({ publishedAt: FUTURE_DATE, slug: "soon" }),
    ]
    const result = getAllClassesForRender()
    const pub = result.find((c) => c.slug === "pub")!
    const soon = result.find((c) => c.slug === "soon")!
    expect(pub.isDraft).toBe(false)
    expect(pub.isComingSoon).toBe(false)
    expect(soon.isDraft).toBe(false)
    expect(soon.isComingSoon).toBe(true)
  })
})

describe("getClassBySlug", () => {
  beforeEach(() => {
    mockAllClasses.value = []
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("returns null for unknown slug", () => {
    mockAllClasses.value = [makeClass({ slug: "real" })]
    expect(getClassBySlug("nonexistent")).toBeNull()
  })

  it("returns matching class for known slug", () => {
    mockAllClasses.value = [makeClass({ slug: "my-class", publishedAt: PAST_DATE })]
    const result = getClassBySlug("my-class")
    expect(result).not.toBeNull()
    expect(result!.slug).toBe("my-class")
  })

  it("returns null for draft slug in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    mockAllClasses.value = [makeClass({ slug: "draft-class", publishedAt: undefined })]
    expect(getClassBySlug("draft-class")).toBeNull()
  })

  it("returns draft class in development", () => {
    vi.stubEnv("NODE_ENV", "development")
    mockAllClasses.value = [makeClass({ slug: "draft-class", publishedAt: undefined })]
    const result = getClassBySlug("draft-class")
    expect(result).not.toBeNull()
    expect(result!.isDraft).toBe(true)
  })

  it("returns coming-soon class in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    mockAllClasses.value = [makeClass({ slug: "upcoming", publishedAt: FUTURE_DATE })]
    const result = getClassBySlug("upcoming")
    expect(result).not.toBeNull()
    expect(result!.isComingSoon).toBe(true)
  })
})

describe("formatComingSoonDate", () => {
  it("formats a future date as 'Coming Mon YYYY'", () => {
    const result = formatComingSoonDate("2099-09-15")
    expect(result).toBe("Coming Sep 2099")
  })

  it("formats a near-future date correctly", () => {
    const result = formatComingSoonDate("2026-12-01")
    expect(result).toBe("Coming Dec 2026")
  })

  it("returns empty string for missing publishedAt", () => {
    expect(formatComingSoonDate(undefined)).toBe("")
  })

  it("returns empty string for invalid date", () => {
    expect(formatComingSoonDate("not-a-date")).toBe("")
  })
})

describe("formatClassDate", () => {
  it("returns formatted coming-soon date for coming-soon class", () => {
    const cls = { ...makeClass({ publishedAt: FUTURE_DATE }), isDraft: false, isComingSoon: true }
    expect(formatClassDate(cls)).toBe("Coming Dec 2099")
  })

  it("returns 'Draft' for draft class", () => {
    const cls = { ...makeClass({ publishedAt: undefined }), isDraft: true, isComingSoon: false }
    expect(formatClassDate(cls)).toBe("Draft")
  })

  it("returns full date for published class", () => {
    const cls = { ...makeClass({ publishedAt: "2024-01-15" }), isDraft: false, isComingSoon: false }
    expect(formatClassDate(cls)).toBe("January 15, 2024")
  })
})
