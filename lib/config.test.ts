import { describe, it, expect } from "vitest"
import { siteConfig } from "./config"

describe("siteConfig", () => {
  it("carries the person-led tagline", () => {
    expect(siteConfig.tagline).toBe(
      "I optimize everything, and I write all of it down.",
    )
  })

  it("describes the person, not the funnel", () => {
    expect(siteConfig.description).toBe(
      "Michael Boutin on building products with AI, the career around it, and the systems that make the rest of it work. Written down as it happens.",
    )
  })

  it("leaves the role untouched", () => {
    expect(siteConfig.role).toBe("Senior Product Engineer")
  })

  it("carries the three-paragraph personal intro as an array", () => {
    expect(Array.isArray(siteConfig.bio)).toBe(true)
    expect(siteConfig.bio).toHaveLength(3)
    expect(siteConfig.bio[0]).toBe(
      "Michael Boutin. Product engineer in Montreal, shipping product for clients I truly care about: Flinks and Zumrails in fintech, Takeup in hospitality, Humanly in AI hiring, ComfyUI in open-source generative AI, Afi Expertise in professional training, and more.",
    )
    expect(siteConfig.bio[1]).toBe(
      "I split my attention two ways. There is what I cannot control: AI is the biggest shift white-collar work has seen in a generation, and I would rather meet it early and use it as leverage. And there is what I can control: my health, my relationships, my head. I optimize everything I touch.",
    )
    expect(siteConfig.bio[2]).toBe(
      "I write here every week about the work and what it teaches me.",
    )
  })

  it("uses no em-dashes in tagline, description, or bio", () => {
    expect(siteConfig.tagline).not.toContain("—")
    expect(siteConfig.description).not.toContain("—")
    for (const paragraph of siteConfig.bio) {
      expect(paragraph).not.toContain("—")
    }
  })

  it("no longer carries a GitHub Sponsors URL now the /sponsor page is gone", () => {
    expect(siteConfig).not.toHaveProperty("githubSponsorsUrl")
  })
})
