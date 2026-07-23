import { describe, it, expect } from "vitest"
import { celsiusToFahrenheit, localizeTemps } from "./temperature"

describe("celsiusToFahrenheit", () => {
  it("uses conventional oven pairings for common temperatures", () => {
    expect(celsiusToFahrenheit(120)).toBe(250)
    expect(celsiusToFahrenheit(160)).toBe(325)
    expect(celsiusToFahrenheit(175)).toBe(350)
    expect(celsiusToFahrenheit(180)).toBe(350)
    expect(celsiusToFahrenheit(220)).toBe(425)
    expect(celsiusToFahrenheit(230)).toBe(450)
  })

  it("falls back to exact conversion rounded to 5 for other temperatures", () => {
    expect(celsiusToFahrenheit(85)).toBe(185)
    expect(celsiusToFahrenheit(63)).toBe(145)
  })
})

describe("localizeTemps", () => {
  it("returns text unchanged for celsius", () => {
    expect(localizeTemps("Oven 160°C, 3 hours.", "c")).toBe("Oven 160°C, 3 hours.")
  })

  it("rewrites celsius mentions to fahrenheit", () => {
    expect(localizeTemps("Oven 160°C, 3 hours.", "f")).toBe("Oven 325°F, 3 hours.")
    expect(localizeTemps("Bake at 230°C, 45 min. Burnt top.", "f")).toBe(
      "Bake at 450°F, 45 min. Burnt top."
    )
  })

  it("handles multiple temperatures and spacing variants", () => {
    expect(localizeTemps("Sear at 250 °C, rest, finish at 120°C.", "f")).toBe(
      "Sear at 500°F, rest, finish at 250°F."
    )
  })

  it("leaves text without temperatures untouched", () => {
    expect(localizeTemps("Mix gently, roll 40 g meatballs.", "f")).toBe(
      "Mix gently, roll 40 g meatballs."
    )
  })
})
