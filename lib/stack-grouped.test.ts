import { describe, it, expect } from "vitest"
import { groupStackByCategory } from "./stack-grouped"
import type { StackItem } from "./data/stack"

describe("groupStackByCategory", () => {
  it("emits buckets in canonical category order (ai > frontend > backend > data > infra > tooling)", () => {
    const fixture: StackItem[] = [
      { name: "Vercel", category: "infra", order: 40 },
      { name: "TypeScript", category: "frontend", order: 10 },
      { name: "GitHub", category: "tooling", order: 50 },
      { name: "Claude Code", category: "ai", order: 2 },
      { name: "PostgreSQL", category: "data", order: 30 },
      { name: "Node.js", category: "backend", order: 20 },
    ]

    const result = groupStackByCategory(fixture)

    expect(result.map((g) => g.category)).toEqual([
      "ai",
      "frontend",
      "backend",
      "data",
      "infra",
      "tooling",
    ])
  })

  it("sorts items within a group by their order ascending", () => {
    const fixture: StackItem[] = [
      { name: "Second", category: "frontend", order: 20 },
      { name: "First", category: "frontend", order: 10 },
      { name: "Third", category: "frontend", order: 30 },
    ]

    const result = groupStackByCategory(fixture)

    expect(result).toHaveLength(1)
    expect(result[0]!.items.map((i) => i.name)).toEqual(["First", "Second", "Third"])
  })

  it("omits categories that have zero items", () => {
    const fixture: StackItem[] = [
      { name: "Solo", category: "frontend", order: 10 },
    ]

    const result = groupStackByCategory(fixture)

    expect(result).toHaveLength(1)
    expect(result.map((g) => g.category)).toEqual(["frontend"])
  })
})
