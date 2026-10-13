import { describe, it, expect, vi } from "vitest"

vi.mock("content-collections", () => ({ allPosts: [] }))

import { formatPostDate } from "./posts"

describe("formatPostDate", () => {
  it("keeps the calendar day of a date-only value west of UTC", () => {
    const previousTz = process.env.TZ
    process.env.TZ = "America/Montreal"
    try {
      expect(formatPostDate("2026-10-13")).toBe("October 13, 2026")
    } finally {
      process.env.TZ = previousTz
    }
  })

  it("returns an empty string for missing or invalid values", () => {
    expect(formatPostDate(undefined)).toBe("")
    expect(formatPostDate("not-a-date")).toBe("")
  })
})
