import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { join } from "path"

const source = readFileSync(join(__dirname, "page.tsx"), "utf-8")

function headingIndex(heading: string) {
  const match = source.match(new RegExp(`>\\s*\\n\\s*${heading}\\s*\\n\\s*</h2>`))
  return match ? match.index ?? -1 : -1
}

function sectionOrder(headings: string[]) {
  return headings.map(headingIndex)
}

describe("/about page structure", () => {
  it("renders the Intro section instead of a one-paragraph Bio", () => {
    expect(headingIndex("Intro")).toBeGreaterThan(-1)
    expect(headingIndex("Bio")).toBe(-1)
  })

  it("maps the bio array to one paragraph per entry", () => {
    expect(source).toContain("siteConfig.bio.map")
  })

  it("orders the sections person-page first, with Tech Stack below Experience", () => {
    const positions = sectionOrder([
      "Intro",
      "Experience",
      "Tech Stack",
      "Education",
      "Open Source",
      "Newsletter",
    ])
    for (const p of positions) {
      expect(p).toBeGreaterThan(-1)
    }
    const sorted = [...positions].sort((a, b) => a - b)
    expect(positions).toEqual(sorted)
  })

  it("leaves a reserved slot for the What I am into section", () => {
    expect(source).toContain("What I am into")
  })

  it("carries the newsletter in the foot-of-page dark card with a subscribe form", () => {
    expect(source).toContain('variant="dark"')
    expect(source).toContain("SubscribeForm")
    expect(source).toContain('source="about"')
  })

  it("has no resume CTA or Get in touch button below the header", () => {
    const afterHeader = source.slice(source.indexOf("Intro"))
    expect(afterHeader).not.toContain("Get in touch")
    expect(afterHeader).not.toContain("buttonVariants")
  })

  it("keeps the quiet View Resume link in the header", () => {
    expect(source).toContain("View Resume")
    expect(source).toContain('href="/resume"')
  })

  it("uses no em-dashes in the newsletter card copy", () => {
    const cardStart = source.indexOf('variant="dark"')
    const cardCopy = source.slice(cardStart)
    expect(cardCopy).not.toContain("—")
  })
})
