import type { Handbook } from "./types"

// Every skill a skill loads, directly or through the ones it loads.
export function installClosure(name: string, skills: Handbook["skills"]): string[] {
  const byName = new Map(skills.map((s) => [s.name, s]))
  const seen = new Set<string>()
  const visit = (n: string) => {
    for (const u of byName.get(n)?.uses ?? []) {
      if (!seen.has(u) && u !== name) {
        seen.add(u)
        visit(u)
      }
    }
  }
  visit(name)
  return [...seen]
}
