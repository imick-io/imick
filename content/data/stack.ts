// Stack data — populated during /grill-me bio interview (Q6).
//
// Decisions (locked):
// - Q6a: Will render as a "Stack" section on the about page (between Experience and Education). Render wiring is deferred to implementation phase.
// - Q6b: AI-first categorization. Categories ordered: ai > frontend > backend > data > infra > tooling.
// - Q6c: 30 items. AI tools lead. Tableau / Power BI dropped (already named in CGI experience entry; no need to double-list).

export type StackCategory = "ai" | "frontend" | "backend" | "data" | "infra" | "tooling"

export type StackItem = {
  name: string
  category: StackCategory
  /** Global sort order. Render should group by category in canonical order (ai, frontend, backend, data, infra, tooling) and sort within group by `order`. */
  order: number
}

export const stack: StackItem[] = [
  // AI — leads the list. Reinforces the "AI Product Engineer" headline.
  { name: "Claude", category: "ai", order: 1 },
  { name: "Claude Code", category: "ai", order: 2 },
  { name: "MCP", category: "ai", order: 3 },
  { name: "OpenAI", category: "ai", order: 4 },

  // Frontend
  { name: "TypeScript", category: "frontend", order: 10 },
  { name: "React", category: "frontend", order: 11 },
  { name: "Next.js", category: "frontend", order: 12 },
  { name: "Server Actions", category: "frontend", order: 13 },
  { name: "Tailwind CSS", category: "frontend", order: 14 },
  { name: "shadcn/ui", category: "frontend", order: 15 },
  { name: "Vue", category: "frontend", order: 16 },
  { name: "Nuxt", category: "frontend", order: 17 },
  { name: "Three.js", category: "frontend", order: 18 },

  // Backend
  { name: "Node.js", category: "backend", order: 20 },
  { name: "Python", category: "backend", order: 21 },
  { name: "FastAPI", category: "backend", order: 22 },

  // Data
  { name: "PostgreSQL", category: "data", order: 30 },
  { name: "Neon", category: "data", order: 31 },
  { name: "Drizzle", category: "data", order: 32 },
  { name: "Firebase", category: "data", order: 33 },

  // Infra
  { name: "Vercel", category: "infra", order: 40 },
  { name: "Docker", category: "infra", order: 41 },

  // Tooling
  { name: "GitHub", category: "tooling", order: 50 },
  { name: "Better Auth", category: "tooling", order: 51 },
  { name: "Clerk", category: "tooling", order: 52 },
  { name: "Sanity", category: "tooling", order: 53 },
  { name: "PostHog", category: "tooling", order: 54 },
  { name: "Storybook", category: "tooling", order: 55 },
  { name: "Jest", category: "tooling", order: 56 },
  { name: "Azure DevOps", category: "tooling", order: 57 },
]
