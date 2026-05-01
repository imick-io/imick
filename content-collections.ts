import { defineCollection, defineConfig } from "@content-collections/core"
import { z } from "zod"

// ─── Phase 2: Blog posts (MDX) ───────────────────────────────────────────────

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    category: z.enum(["opinion", "technical", "other"]),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
    status: z.enum(["draft", "published"]).default("draft"),
  }),
})

// ─── Phase 2: Code snippets (MDX) ────────────────────────────────────────────

const snippets = defineCollection({
  name: "snippets",
  directory: "content/snippets",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    language: z.string(),
    tags: z.array(z.string()),
    description: z.string().optional(),
  }),
})

export default defineConfig({
  content: [posts, snippets],
})
