import { describe, it, expect } from "vitest"
import { bookmarks, type Bookmark, type NewBookmark } from "./schema"

describe("bookmarks Enrichment status columns", () => {
  it("exposes an ai_status column as a pending/running/done/failed enum defaulting to done", () => {
    const col = bookmarks.aiStatus
    expect(col.name).toBe("ai_status")
    expect(col.notNull).toBe(true)
    expect(col.default).toBe("done")
    expect(col.enumValues).toEqual(["pending", "running", "done", "failed"])
  })

  it("exposes an ai_attempts integer column defaulting to 0", () => {
    const col = bookmarks.aiAttempts
    expect(col.name).toBe("ai_attempts")
    expect(col.notNull).toBe(true)
    expect(col.default).toBe(0)
  })

  it("surfaces both columns on the derived Select type", () => {
    const b = {} as Bookmark
    const status: "pending" | "running" | "done" | "failed" = b.aiStatus
    const attempts: number = b.aiAttempts
    expect([status, attempts]).toBeDefined()
  })

  it("leaves both columns optional on the derived Insert type (defaults apply)", () => {
    const insert: NewBookmark = {
      url: "https://example.com",
      slug: "example",
      title: "Example",
    }
    expect(insert.aiStatus).toBeUndefined()
    expect(insert.aiAttempts).toBeUndefined()
  })
})
