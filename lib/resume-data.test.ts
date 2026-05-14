import { describe, it, expect } from "vitest"
import { buildResumeData } from "./resume-data"
import { siteConfig } from "./config"
import type { Experience } from "./data/experience"
import type { Education } from "./data/education"
import type { StackItem } from "./data/stack"

const minimalEducation: Education[] = [
  {
    institution: "Test University",
    degree: "Bachelor of Testing",
    startYear: 2010,
    endYear: 2013,
    order: 1,
  },
]

const minimalStack: StackItem[] = [
  { name: "React", category: "frontend", order: 10 },
]

describe("buildResumeData", () => {
  it("strips summary and highlights from compact engagements while preserving non-compact ones", () => {
    const experience: Experience[] = [
      {
        company: "Concreo",
        role: "Founder",
        startDate: "2020-08",
        current: true,
        description: "Agency.",
        highlights: ["h1"],
        order: 1,
        engagements: [
          {
            name: "Non-Compact",
            role: "Dev",
            startDate: "2024-06",
            current: true,
            summary: "Should remain.",
            highlights: ["should remain"],
            tech: ["Next.js"],
            order: 1,
          },
          {
            name: "Compact",
            role: "Dev",
            startDate: "2021-08",
            endDate: "2022-02",
            summary: "Should be dropped.",
            highlights: ["should be dropped"],
            tech: ["React"],
            compact: true,
            outcome: "Acquired (2023)",
            order: 2,
          },
        ],
      },
    ]

    const result = buildResumeData(experience, minimalEducation, minimalStack)

    const engagements = result.experience[0]!.engagements!
    expect(engagements).toHaveLength(2)

    const nonCompact = engagements[0]!
    expect(nonCompact.name).toBe("Non-Compact")
    expect(nonCompact.summary).toBe("Should remain.")
    expect(nonCompact.highlights).toEqual(["should remain"])

    const compact = engagements[1]!
    expect(compact.name).toBe("Compact")
    expect(compact.tech).toEqual(["React"])
    expect(compact.outcome).toBe("Acquired (2023)")
    expect(compact.summary).toBeUndefined()
    expect(compact.highlights).toBeUndefined()
  })

  it("populates the header with the resume email (not contactEmail) and the configured contact fields", () => {
    const result = buildResumeData([], minimalEducation, minimalStack)

    expect(result.header.email).toBe(siteConfig.resumeEmail)
    expect(result.header.email).not.toBe(siteConfig.contactEmail)
    expect(result.header.linkedin).toBe(siteConfig.resumeLinkedin)
    expect(result.header.github).toBe(siteConfig.resumeGithub)
    expect(result.header.website).toBe(siteConfig.handle)
    expect(result.header.location).toBe(siteConfig.resumeLocation)
    expect(result.header.name).toBe(siteConfig.name)
    expect(result.header.role).toBe(siteConfig.role)
    expect(result.bio).toBe(siteConfig.resumeBio)
  })

  it("returns top-level experience entries in order ascending and preserves outcome / via", () => {
    const experience: Experience[] = [
      {
        company: "Charlie Co",
        role: "Engineer",
        startDate: "2018-01",
        endDate: "2019-01",
        description: "Third by order.",
        highlights: ["h1"],
        order: 3,
      },
      {
        company: "Alpha Co",
        role: "Engineer",
        startDate: "2021-01",
        current: true,
        description: "First by order.",
        highlights: ["h1"],
        outcome: "Acquired (2024)",
        order: 1,
      },
      {
        company: "Bravo Co",
        role: "Engineer",
        startDate: "2020-01",
        endDate: "2020-12",
        description: "Second by order.",
        highlights: ["h1"],
        via: { name: "Wrapper Inc." },
        order: 2,
      },
    ]

    const result = buildResumeData(experience, minimalEducation, minimalStack)

    expect(result.experience.map((e) => e.company)).toEqual([
      "Alpha Co",
      "Bravo Co",
      "Charlie Co",
    ])
    expect(result.experience[0]!.outcome).toBe("Acquired (2024)")
    expect(result.experience[1]!.via).toEqual({ name: "Wrapper Inc." })
  })
})
