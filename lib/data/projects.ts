// Open Source data — populated during /grill-me bio interview (Q8).
//
// Decisions (locked):
// - Section name on about page: "Open Source" (kept). Strict OSS only — non-OSS work belongs in Experience.
// - Empty array intentionally. Nothing featured until:
//   1. GitHub profile cleanup happens (~28 legacy tutorial repos at github.com/imick-io to be privatized first).
//   2. Phase 1/2/3 artifacts from _learning-plan.md start shipping into public repos.
// - Implementation note: app/about/page.tsx currently maps over `projects` and renders the section even when empty. When wiring up, either hide the section when the array is empty or render an explicit empty state.

export type Project = {
  name: string
  description: string
  githubUrl: string
  url?: string
  stars?: number
  featured?: boolean
  order: number
}

export const projects: Project[] = []
