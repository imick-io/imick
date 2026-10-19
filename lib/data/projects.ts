// Open Source data — populated during /grill-me bio interview (Q8).
//
// Decisions (locked):
// - Section name on about page: "Open Source" (kept). Strict OSS only — non-OSS work belongs in Experience.
// - Featured so far: imick-io/skills only, ahead of the rest. Nothing else is featured until:
//   1. GitHub profile cleanup happens (~28 legacy tutorial repos at github.com/imick-io to be privatized first).
//   2. Phase 1/2/3 artifacts from _learning-plan.md start shipping into public repos.
// - `url`, when set, is where the card links (an on-site page); otherwise it links to `githubUrl`.

export type Project = {
  name: string
  description: string
  githubUrl: string
  url?: string
  stars?: number
  featured?: boolean
  order: number
}

export const projects: Project[] = [
  {
    name: "imick-io/skills",
    description:
      "My agent skills for Claude Code: from an idea to merged code, with an agent loop that plans, builds and verifies on its own. The handbook shows the flow, the labels and which skill uses which.",
    githubUrl: "https://github.com/imick-io/skills",
    url: "/skills",
    featured: true,
    order: 1,
  },
]
