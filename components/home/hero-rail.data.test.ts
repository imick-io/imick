import { describe, it, expect } from "vitest"
import {
  heroSubjects,
  heroHeadline,
  heroEyebrow,
  heroLetterPromise,
  heroLinks,
} from "./hero-rail.data"
import { siteConfig } from "@/lib/config"

describe("hero rail data", () => {
  it("lists the four subjects in order with label, note, and href", () => {
    expect(heroSubjects).toEqual([
      {
        label: "Building",
        note: "products, start to finish",
        href: "/learn/articles",
      },
      {
        label: "The career",
        note: "craft, focus, and the long game",
        href: "/about",
      },
      {
        label: "Cooking",
        note: "29 recipes and counting",
        href: "/cooking",
      },
      {
        label: "Bookmarks",
        note: "what I use and what I want to try",
        href: "/bookmarks",
      },
    ])
  })

  it("uses the person-led headline that matches the site tagline", () => {
    expect(heroHeadline).toBe(
      "I optimize everything, and I write all of it down.",
    )
    expect(heroHeadline).toBe(siteConfig.tagline)
  })

  it("names the person and city in the eyebrow", () => {
    expect(heroEyebrow).toBe(`${siteConfig.name} · Montreal`)
  })

  it("carries the letter promise line", () => {
    expect(heroLetterPromise).toBe(
      "Every other Tuesday, a short letter about what I am building, reading, and cooking.",
    )
  })

  it("keeps 'More about me' as the primary link and 'Get in touch' as the muted link", () => {
    expect(heroLinks).toEqual({
      primary: { label: "More about me", href: "/about" },
      muted: { label: "Get in touch", href: "/contact" },
    })
  })

  it("holds no em-dashes in any hero copy", () => {
    const copy = [
      heroHeadline,
      heroEyebrow,
      heroLetterPromise,
      ...heroSubjects.flatMap((s) => [s.label, s.note]),
      heroLinks.primary.label,
      heroLinks.muted.label,
    ].join(" ")
    expect(copy).not.toContain("—")
  })
})
