import { describe, it, expect } from "vitest"
import { isReviewed } from "./bookmarks-meta"

describe("isReviewed", () => {
  it("returns true when rating is set", () => {
    expect(isReviewed({ rating: 4, reviewText: null })).toBe(true)
  })

  it("returns true when reviewText is set", () => {
    expect(isReviewed({ rating: null, reviewText: "Great tool" })).toBe(true)
  })

  it("returns true when both rating and reviewText are set", () => {
    expect(isReviewed({ rating: 5, reviewText: "Amazing" })).toBe(true)
  })

  it("returns false when neither rating nor reviewText is set", () => {
    expect(isReviewed({ rating: null, reviewText: null })).toBe(false)
  })
})
