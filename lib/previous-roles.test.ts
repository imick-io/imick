import { describe, it, expect, vi, beforeEach } from "vitest"

import type { Experience } from "./data/experience"

const mockExperience: Experience[] = []

vi.mock("./data/experience", () => ({
  get experience() {
    return mockExperience
  },
}))

const { getPreviousRolesStrip } = await import("./previous-roles")

beforeEach(() => {
  mockExperience.length = 0
})

const takeup: Experience = {
  company: "Takeup",
  role: "Senior Full-Stack Engineer",
  startDate: "2024-12",
  endDate: "2026-05",
  description: "Pricing platform.",
  highlights: [],
  via: { name: "Toptal" },
  order: 1,
}

const zumrails: Experience = {
  company: "Zumrails",
  role: "Product Owner & Front-End Developer",
  startDate: "2022-01",
  endDate: "2023-12",
  description: "Fintech platform.",
  highlights: [],
  order: 2,
}

const flinks: Experience = {
  company: "Flinks",
  role: "Product Owner",
  startDate: "2019-01",
  endDate: "2021-12",
  description: "PLG and Wealth Data.",
  highlights: [],
  order: 3,
}

describe("getPreviousRolesStrip", () => {
  it("returns three chips in the locked order: Takeup, Flinks, Zumrails", () => {
    mockExperience.push(takeup, zumrails, flinks)

    const chips = getPreviousRolesStrip()

    expect(chips).toHaveLength(3)
    expect(chips.map((c) => c.company)).toEqual(["Takeup", "Flinks", "Zumrails"])
    for (const chip of chips) {
      expect(chip.role).toBeTruthy()
      expect(chip.outcome).toBeTruthy()
    }
  })

  it("populates each chip with the locked outcome label", () => {
    mockExperience.push(takeup, zumrails, flinks)

    const [takeupChip, flinksChip, zumrailsChip] = getPreviousRolesStrip()

    expect(takeupChip).toMatchObject({
      company: "Takeup",
      role: "Senior Full-Stack Engineer",
      outcome: "18 months senior full-stack",
    })
    expect(flinksChip).toMatchObject({
      company: "Flinks",
      role: "Product Owner",
      outcome: "acquired $100M",
    })
    expect(zumrailsChip).toMatchObject({
      company: "Zumrails",
      role: "Product Owner & Front-End Developer",
      outcome: "$100M+ raise",
    })
  })

  it("throws when the Takeup employer is missing", () => {
    mockExperience.push(zumrails, flinks)

    expect(() => getPreviousRolesStrip()).toThrow(/Takeup/)
  })

  it("throws when the Flinks employer is missing", () => {
    mockExperience.push(takeup, zumrails)

    expect(() => getPreviousRolesStrip()).toThrow(/Flinks/)
  })

  it("throws when the Zumrails employer is missing", () => {
    mockExperience.push(takeup, flinks)

    expect(() => getPreviousRolesStrip()).toThrow(/Zumrails/)
  })
})
