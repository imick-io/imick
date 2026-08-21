import { describe, it, expect } from "vitest"
import {
  normalizeBookmarkUrl,
  parseBookmarkUrls,
  partitionNewUrls,
  encodeBatchReport,
  decodeBatchReport,
} from "./bookmark-batch"

describe("normalizeBookmarkUrl", () => {
  it("lowercases the host", () => {
    expect(normalizeBookmarkUrl("https://Example.COM/path")).toBe(
      "example.com/path"
    )
  })

  it("strips a trailing slash", () => {
    expect(normalizeBookmarkUrl("https://example.com/")).toBe("example.com")
  })

  it("strips multiple trailing slashes", () => {
    expect(normalizeBookmarkUrl("https://example.com/path///")).toBe(
      "example.com/path"
    )
  })

  it("unifies http and https", () => {
    expect(normalizeBookmarkUrl("http://example.com/a")).toBe(
      normalizeBookmarkUrl("https://example.com/a")
    )
  })

  it("unifies www and non-www", () => {
    expect(normalizeBookmarkUrl("https://www.example.com/a")).toBe(
      normalizeBookmarkUrl("https://example.com/a")
    )
  })

  it("preserves the query string", () => {
    expect(normalizeBookmarkUrl("https://example.com/s?q=1")).toBe(
      "example.com/s?q=1"
    )
  })

  it("drops the fragment", () => {
    expect(normalizeBookmarkUrl("https://example.com/a#section")).toBe(
      "example.com/a"
    )
  })

  it("returns null for a non-URL", () => {
    expect(normalizeBookmarkUrl("not a url")).toBeNull()
  })

  it("returns null for a non-http(s) scheme", () => {
    expect(normalizeBookmarkUrl("ftp://example.com")).toBeNull()
  })

  it("returns null for a bare domain with no scheme", () => {
    expect(normalizeBookmarkUrl("example.com")).toBeNull()
  })
})

describe("parseBookmarkUrls", () => {
  it("returns empty results for an empty string", () => {
    expect(parseBookmarkUrls("")).toEqual({ valid: [], invalid: [] })
  })

  it("returns empty results for whitespace-only input", () => {
    expect(parseBookmarkUrls("   \n  \t ")).toEqual({ valid: [], invalid: [] })
  })

  it("parses a single URL", () => {
    const result = parseBookmarkUrls("https://example.com/a")
    expect(result.valid).toEqual([
      { url: "https://example.com/a", key: "example.com/a" },
    ])
    expect(result.invalid).toEqual([])
  })

  it("splits on newlines", () => {
    const result = parseBookmarkUrls("https://a.com\nhttps://b.com")
    expect(result.valid.map((v) => v.url)).toEqual([
      "https://a.com",
      "https://b.com",
    ])
  })

  it("splits on commas and whitespace", () => {
    const result = parseBookmarkUrls("https://a.com, https://b.com\thttps://c.com")
    expect(result.valid.map((v) => v.url)).toEqual([
      "https://a.com",
      "https://b.com",
      "https://c.com",
    ])
  })

  it("ignores blank lines and stray whitespace", () => {
    const result = parseBookmarkUrls("\n\n  https://a.com  \n\n")
    expect(result.valid.map((v) => v.url)).toEqual(["https://a.com"])
  })

  it("surfaces invalid lines", () => {
    const result = parseBookmarkUrls("https://a.com\nnope\nhttps://b.com")
    expect(result.valid.map((v) => v.url)).toEqual([
      "https://a.com",
      "https://b.com",
    ])
    expect(result.invalid).toEqual(["nope"])
  })

  it("dedupes within the paste by normalized key, preserving first-seen order", () => {
    const result = parseBookmarkUrls(
      "https://www.a.com/\nhttps://b.com\nhttp://a.com"
    )
    expect(result.valid.map((v) => v.url)).toEqual([
      "https://www.a.com/",
      "https://b.com",
    ])
  })
})

describe("partitionNewUrls", () => {
  const parse = (raw: string) => parseBookmarkUrls(raw).valid

  it("returns empty partitions for empty input", () => {
    expect(partitionNewUrls([], new Set())).toEqual({
      toCreate: [],
      skipped: [],
    })
  })

  it("keeps everything when nothing exists", () => {
    const parsed = parse("https://a.com\nhttps://b.com")
    const { toCreate, skipped } = partitionNewUrls(parsed, new Set())
    expect(toCreate.map((v) => v.url)).toEqual(["https://a.com", "https://b.com"])
    expect(skipped).toEqual([])
  })

  it("skips URLs whose normalized key already exists", () => {
    const parsed = parse("https://a.com\nhttps://b.com")
    const { toCreate, skipped } = partitionNewUrls(
      parsed,
      new Set(["a.com"])
    )
    expect(toCreate.map((v) => v.url)).toEqual(["https://b.com"])
    expect(skipped.map((v) => v.url)).toEqual(["https://a.com"])
  })

  it("skips existing across trivial URL variants", () => {
    const parsed = parse("http://www.a.com/")
    const { toCreate, skipped } = partitionNewUrls(parsed, new Set(["a.com"]))
    expect(toCreate).toEqual([])
    expect(skipped.map((v) => v.url)).toEqual(["http://www.a.com/"])
  })

  it("skips everything when all are duplicates", () => {
    const parsed = parse("https://a.com\nhttps://b.com")
    const { toCreate, skipped } = partitionNewUrls(
      parsed,
      new Set(["a.com", "b.com"])
    )
    expect(toCreate).toEqual([])
    expect(skipped.map((v) => v.url)).toEqual(["https://a.com", "https://b.com"])
  })

})

describe("batch report transport", () => {
  it("round-trips a report through encode/decode", () => {
    const report = {
      created: 2,
      skipped: ["https://a.com/?q=1"],
      invalid: ["nope"],
    }
    expect(decodeBatchReport(encodeBatchReport(report))).toEqual(report)
  })

  it("returns null for a missing param", () => {
    expect(decodeBatchReport(undefined)).toBeNull()
    expect(decodeBatchReport(null)).toBeNull()
    expect(decodeBatchReport("")).toBeNull()
  })

  it("returns null for a malformed param", () => {
    expect(decodeBatchReport("!!!not-base64-json")).toBeNull()
  })
})
