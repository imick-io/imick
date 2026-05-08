import { generateObject } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"

const aiBookmarkSchema = z.object({
  category: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Category must be a kebab-case slug"),
  tags: z.array(z.string()).min(1).max(5),
  pros: z.array(z.string()).min(2).max(4),
  cons: z.array(z.string()).min(0).max(4),
  aiSummary: z.string(),
})

export type AiBookmarkOutput = z.infer<typeof aiBookmarkSchema>

export interface GenerateBookmarkAiResult extends AiBookmarkOutput {
  suggestedCategory: string | null
}

interface GenerateBookmarkAiInput {
  url: string
  pageText: string
  microlinkDescription: string
  existingTags: string[]
  existingCategories: string[]
}

export async function generateBookmarkAi(
  input: GenerateBookmarkAiInput
): Promise<GenerateBookmarkAiResult> {
  const { url, pageText, microlinkDescription, existingTags, existingCategories } = input

  const tagVocabulary =
    existingTags.length > 0
      ? `Existing tag vocabulary: ${existingTags.join(", ")}. Prefer reusing existing tags when they fit.`
      : ""

  const hasCategories = existingCategories.length > 0
  const categoryVocabulary = hasCategories
    ? `Existing categories: ${existingCategories.join(", ")}. Set "category" to the closest fit from this list, even if none is a perfect match. If you think a category outside this list would be more accurate, set "suggestedCategory" to a kebab-case slug for it. Otherwise set "suggestedCategory" to null. Never set both to the same value.`
    : `No categories exist yet. Invent a concise kebab-case slug for "category" (e.g. "dev-tools", "design", "ai-productivity") and set "suggestedCategory" to null.`

  const pageTextSection = pageText
    ? [`Page text:`, pageText]
    : [
        `Page text could not be extracted from the URL (the site may be a JS-rendered SPA or block automated fetches).`,
        `Rely on the URL, description, and your own knowledge of the site or product to infer reasonable metadata.`,
      ]

  const dynamicSchema = z.object({
    category: hasCategories
      ? z.enum(existingCategories as [string, ...string[]])
      : z
          .string()
          .min(1)
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Category must be a kebab-case slug"),
    tags: z.array(z.string()).min(1).max(5),
    pros: z.array(z.string()).min(2).max(4),
    cons: z.array(z.string()).min(0).max(4),
    aiSummary: z.string(),
    suggestedCategory: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a kebab-case slug")
      .nullable(),
  })

  const result = await generateObject({
    model: anthropic("claude-sonnet-4-6"),
    temperature: 0.2,
    schema: dynamicSchema,
    schemaName: "AiBookmarkOutput",
    schemaDescription:
      "AI-generated metadata for a bookmarked developer tool or resource.",
    prompt: [
      `Analyze the following web page and generate structured metadata for it.`,
      ``,
      `URL: ${url}`,
      `Description: ${microlinkDescription}`,
      ``,
      ...pageTextSection,
      ``,
      categoryVocabulary,
      tagVocabulary,
      ``,
      `Instructions:`,
      `- category: pick per the rule above.`,
      `- suggestedCategory: a more accurate category outside the existing list, or null. Set to null when no existing categories were provided, and never duplicate the value of "category".`,
      `- Generate 1-5 relevant tags as lowercase keywords.`,
      `- Write 2-4 short pro bullets (factual strengths, ~80 chars each).`,
      `- Write 0-4 short con bullets (factual weaknesses, ~80 chars each). If none apply, return an empty array.`,
      `- Write a neutral aiSummary of ~60 words: 2-3 sentences, no first-person, no superlatives.`,
    ].join("\n"),
  })

  return {
    category: result.object.category.toLowerCase(),
    tags: result.object.tags.map((t) => t.trim().toLowerCase()),
    pros: result.object.pros,
    cons: result.object.cons,
    aiSummary: result.object.aiSummary,
    suggestedCategory: result.object.suggestedCategory ?? null,
  }
}

interface ExistingAiFields {
  category: string | null
  tags: string[]
  pros: string[]
  cons: string[]
  aiSummary: string | null
}

export function mergeAiFields(
  existing: ExistingAiFields,
  ai: AiBookmarkOutput,
  force: boolean
): AiBookmarkOutput {
  if (force) return { ...ai }

  return {
    category: existing.category ?? ai.category,
    tags: existing.tags.length > 0 ? existing.tags : ai.tags,
    pros: existing.pros.length > 0 ? existing.pros : ai.pros,
    cons: existing.cons.length > 0 ? existing.cons : ai.cons,
    aiSummary: existing.aiSummary ?? ai.aiSummary,
  }
}
