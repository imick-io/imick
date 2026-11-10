import { describe, it, expect } from "vitest"
import { formatQuantity, scaleNote } from "./recipe-scaling"

describe("formatQuantity", () => {
  it("formats whole numbers, fractions, and mixed numbers", () => {
    expect(formatQuantity(3)).toBe("3")
    expect(formatQuantity(0.5)).toBe("1/2")
    expect(formatQuantity(2 / 3)).toBe("2/3")
    expect(formatQuantity(2.25)).toBe("2 1/4")
  })

  it("rounds to the nearest measurable amount", () => {
    expect(formatQuantity(0.03)).toBe("1/16")
    expect(formatQuantity(0.6)).toBe("5/8")
    expect(formatQuantity(1.4)).toBe("1 1/3")
    expect(formatQuantity(5.2)).toBe("5")
    expect(formatQuantity(7.6)).toBe("7 1/2")
    expect(formatQuantity(15.6)).toBe("16")
  })
})

describe("scaleNote", () => {
  it("leaves notes untouched at 1x", () => {
    expect(scaleNote("3 cloves, minced", 1)).toBe("3 cloves, minced")
  })

  it("scales the leading quantity", () => {
    expect(scaleNote("3 cloves, minced", 2)).toBe("6 cloves, minced")
    expect(scaleNote("2 tbsp, fresh", 2)).toBe("4 tbsp, fresh")
    expect(scaleNote("1/2 tsp", 2)).toBe("1 tsp")
    expect(scaleNote("1 tsp kosher", 0.5)).toBe("1/2 tsp kosher")
    expect(scaleNote("1 1/2 tsp", 2)).toBe("3 tsp")
    expect(scaleNote("4", 2)).toBe("8")
  })

  it("scales ranges", () => {
    expect(scaleNote("2-3 bananas", 2)).toBe("4-6 bananas")
    expect(scaleNote("0-3 tbsp, to taste", 2)).toBe("0-6 tbsp, to taste")
  })

  it("pluralizes and singularizes countable words", () => {
    expect(scaleNote("1 clove", 2)).toBe("2 cloves")
    expect(scaleNote("2 cloves", 0.5)).toBe("1 clove")
    expect(scaleNote("1 recipe, 2 discs", 0.5)).toBe("1/2 recipe, 1 disc")
    expect(scaleNote("1 skinless fillet", 2)).toBe("2 skinless fillets")
    expect(scaleNote("3 medium cloves, or 2 large", 2)).toBe(
      "6 medium cloves, or 2 large"
    )
    expect(scaleNote("1 tsp kosher", 2)).toBe("2 tsp kosher")
  })

  it("scales the leading quantity of every segment", () => {
    expect(scaleNote("7 for vanilla, 6 for chocolate", 2)).toBe(
      "14 for vanilla, 12 for chocolate"
    )
    expect(scaleNote("420 ml, 1 1/3 cup", 2)).toBe("840 ml, 2 2/3 cups")
  })

  it("leaves per-unit sizes, percentages, and temperatures alone", () => {
    expect(scaleNote("2 cans, 28 oz / 796 ml each", 2)).toBe(
      "4 cans, 28 oz / 796 ml each"
    )
    expect(scaleNote("12 thighs, about 150 g each", 2)).toBe(
      "24 thighs, about 150 g each"
    )
    expect(scaleNote("15% cooking cream or 35%", 2)).toBe(
      "15% cooking cream or 35%"
    )
    expect(scaleNote("1/2 cup, 105-110°F", 2)).toBe("1 cup, 105-110°F")
  })

  it("counts cans rather than resizing them", () => {
    expect(scaleNote("15 oz can", 2)).toBe("2 × 15 oz can")
  })

  it("leaves notes without a quantity alone", () => {
    expect(scaleNote("to taste, optional", 2)).toBe("to taste, optional")
    expect(scaleNote("half a recipe", 2)).toBe("half a recipe")
  })
})

describe("scaleNote at other multipliers", () => {
  it("keeps half portions in kitchen fractions", () => {
    expect(scaleNote("1 1/4 tsp", 0.5)).toBe("5/8 tsp")
    expect(scaleNote("1/8 tsp", 0.5)).toBe("1/16 tsp")
    expect(scaleNote("a pinch, 1/16 tsp", 0.5)).toBe("a pinch, 1/16 tsp")
  })

  it("keeps 1.5x in kitchen fractions", () => {
    expect(scaleNote("1/4 cup", 1.5)).toBe("3/8 cup")
    expect(scaleNote("2 1/4 tsp", 1.5)).toBe("3 1/3 tsp")
  })

  it("rounds odd custom multipliers to measurable amounts", () => {
    expect(scaleNote("3 cloves, minced", 1.3)).toBe("4 cloves, minced")
    expect(scaleNote("8 thighs", 1.3)).toBe("10 thighs")
    expect(scaleNote("12 thighs, about 150 g each", 1.3)).toBe(
      "16 thighs, about 150 g each"
    )
  })
})
