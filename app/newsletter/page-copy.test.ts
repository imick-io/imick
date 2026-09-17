import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { join } from "path"

const source = readFileSync(join(__dirname, "page.tsx"), "utf-8")

const PROMISE_LINE =
  "Every other Tuesday, a short letter about what I am building, reading, and cooking."

const VALUE_PROPS = [
  "One letter every other Tuesday, short enough to read with a coffee.",
  "The articles from the fortnight, plus the parts I did not publish.",
  "What I am building right now, including what is not working.",
  "What I cooked, and what went into my bookmarks.",
  "No tracking pixels. No referral links. Unsubscribe in one click.",
]

describe("/newsletter page copy", () => {
  it("drops the 'Notes on shipping software' framing", () => {
    expect(source).not.toContain("Notes on shipping software")
  })

  it("renders the promise line next to the subscribe form", () => {
    expect(source).toContain(PROMISE_LINE)
  })

  it("lists exactly the five person-led value props in order", () => {
    for (const prop of VALUE_PROPS) {
      expect(source).toContain(prop)
    }
    const startArray = source.indexOf("const valueProps")
    const positions = VALUE_PROPS.map((prop) =>
      source.indexOf(prop, startArray),
    )
    const sorted = [...positions].sort((a, b) => a - b)
    expect(positions).toEqual(sorted)
  })

  it("states the cadence as every other Tuesday", () => {
    expect(source).toContain("every other Tuesday")
  })

  it("contains zero em-dashes", () => {
    expect(source).not.toContain("—")
  })
})
