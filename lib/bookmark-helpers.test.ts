import { describe, it, expect } from "vitest"
import { parseProsConsText } from "./bookmark-helpers"

describe("parseProsConsText", () => {
  it("splits newline-separated lines into an array", () => {
    expect(parseProsConsText("Fast build times\nGreat DX\nWell documented")).toEqual([
      "Fast build times",
      "Great DX",
      "Well documented",
    ])
  })

  it("strips leading bullet markers (-, +, *) from lines", () => {
    expect(parseProsConsText("- Fast build times\n+ Great DX\n* Well documented")).toEqual([
      "Fast build times",
      "Great DX",
      "Well documented",
    ])
  })

  it("filters out empty lines", () => {
    expect(parseProsConsText("Fast\n\n\nGreat")).toEqual(["Fast", "Great"])
  })

  it("trims whitespace from each line", () => {
    expect(parseProsConsText("  Fast build times  \n  Great DX  ")).toEqual([
      "Fast build times",
      "Great DX",
    ])
  })

  it("returns [] for null input", () => {
    expect(parseProsConsText(null)).toEqual([])
  })

  it("returns [] for undefined input", () => {
    expect(parseProsConsText(undefined)).toEqual([])
  })

  it("returns [] for empty string input", () => {
    expect(parseProsConsText("")).toEqual([])
  })

  it("returns [] for whitespace-only input", () => {
    expect(parseProsConsText("   \n  \n  ")).toEqual([])
  })

  it("does not produce [''] from a single empty-looking line", () => {
    expect(parseProsConsText("-")).toEqual([])
    expect(parseProsConsText("- ")).toEqual([])
  })
})
