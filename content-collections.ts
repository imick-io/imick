import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypePrettyCode, { type Options as RehypePrettyCodeOptions } from "rehype-pretty-code"
import { z } from "zod"

const prettyCodeOptions: RehypePrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
}

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.string().optional(),
    updatedAt: z.string().optional(),
    category: z.enum(["opinion", "technical", "other"]),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const code = await compileMDX(context, document, {
      rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
    })
    return {
      ...document,
      slug: document._meta.fileName.replace(/\.mdx$/, ""),
      code,
    }
  },
})

const snippets = defineCollection({
  name: "snippets",
  directory: "content/snippets",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    language: z.string(),
    tags: z.array(z.string()),
    description: z.string().optional(),
    publishedAt: z.string().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const code = await compileMDX(context, document, {
      rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
    })
    return {
      ...document,
      slug: document._meta.fileName.replace(/\.mdx$/, ""),
      code,
    }
  },
})

export default defineConfig({
  content: [posts, snippets],
})
