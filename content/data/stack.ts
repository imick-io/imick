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
  /** simple-icons slug — fetched at https://cdn.simpleicons.org/{slug}. Omit for items without a good brand match. */
  iconSlug?: string
}

export const stack: StackItem[] = [
  // AI — leads the list. Reinforces the "AI Product Engineer" headline.
  { name: "Claude", category: "ai", order: 1, iconSlug: "claude" },
  { name: "Claude Code", category: "ai", order: 2, iconSlug: "claude" },
  { name: "MCP", category: "ai", order: 3, iconSlug: "anthropic" },
  { name: "OpenAI", category: "ai", order: 4, iconSlug: "openai" },

  // Frontend
  { name: "TypeScript", category: "frontend", order: 10, iconSlug: "typescript" },
  { name: "React", category: "frontend", order: 11, iconSlug: "react" },
  { name: "Next.js", category: "frontend", order: 12, iconSlug: "nextdotjs" },
  { name: "Server Actions", category: "frontend", order: 13, iconSlug: "nextdotjs" },
  { name: "Tailwind CSS", category: "frontend", order: 14, iconSlug: "tailwindcss" },
  { name: "shadcn/ui", category: "frontend", order: 15, iconSlug: "shadcnui" },
  { name: "Vue", category: "frontend", order: 16, iconSlug: "vuedotjs" },
  { name: "Nuxt", category: "frontend", order: 17, iconSlug: "nuxt" },
  { name: "Three.js", category: "frontend", order: 18, iconSlug: "threedotjs" },

  // Backend
  { name: "Node.js", category: "backend", order: 20, iconSlug: "nodedotjs" },
  { name: "Python", category: "backend", order: 21, iconSlug: "python" },
  { name: "FastAPI", category: "backend", order: 22, iconSlug: "fastapi" },

  // Data
  { name: "PostgreSQL", category: "data", order: 30, iconSlug: "postgresql" },
  { name: "Neon", category: "data", order: 31, iconSlug: "neon" },
  { name: "Drizzle", category: "data", order: 32, iconSlug: "drizzle" },
  { name: "Firebase", category: "data", order: 33, iconSlug: "firebase" },

  // Infra
  { name: "Vercel", category: "infra", order: 40, iconSlug: "vercel" },
  { name: "Docker", category: "infra", order: 41, iconSlug: "docker" },

  // Tooling
  { name: "GitHub", category: "tooling", order: 50, iconSlug: "github" },
  { name: "Better Auth", category: "tooling", order: 51 },
  { name: "Clerk", category: "tooling", order: 52, iconSlug: "clerk" },
  { name: "Sanity", category: "tooling", order: 53, iconSlug: "sanity" },
  { name: "PostHog", category: "tooling", order: 54, iconSlug: "posthog" },
  { name: "Storybook", category: "tooling", order: 55, iconSlug: "storybook" },
  { name: "Jest", category: "tooling", order: 56, iconSlug: "jest" },
  { name: "Azure DevOps", category: "tooling", order: 57, iconSlug: "azuredevops" },
]
