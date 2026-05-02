import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypePrettyCode, { type Options as RehypePrettyCodeOptions } from "rehype-pretty-code"
import { codeToHtml, type BundledLanguage } from "shiki"
import { z } from "zod"
import { extractHeadings, readingTimeMinutes } from "./lib/mdx-helpers"

const prettyCodeOptions: RehypePrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
}

const PREVIEW_LINE_LIMIT = 10

async function buildSnippetPreview(content: string, fallbackLang: string): Promise<string | null> {
  const match = content.match(/```([\w-]+)?[^\n]*\n([\s\S]*?)```/)
  if (!match) return null
  const lang = (match[1] || fallbackLang || "text").toLowerCase()
  const lines = match[2].replace(/\n+$/, "").split("\n")
  const clipped = lines.slice(0, PREVIEW_LINE_LIMIT).join("\n")
  try {
    return await codeToHtml(clipped, {
      lang: lang as BundledLanguage,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    })
  } catch {
    return await codeToHtml(clipped, {
      lang: "text",
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    })
  }
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
      sourcePath: `content/posts/${document._meta.fileName}`,
      headings: extractHeadings(document.content),
      readingMinutes: readingTimeMinutes(document.content),
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
    const previewHtml = await buildSnippetPreview(document.content, document.language)
    return {
      ...document,
      slug: document._meta.fileName.replace(/\.mdx$/, ""),
      sourcePath: `content/snippets/${document._meta.fileName}`,
      code,
      previewHtml,
    }
  },
})

export default defineConfig({
  content: [posts, snippets],
})
