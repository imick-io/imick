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

interface GenerateBookmarkAiInput {
  url: string
  pageText: string
  microlinkDescription: string
  existingTags: string[]
  existingCategories: string[]
}

export async function generateBookmarkAi(
  input: GenerateBookmarkAiInput
): Promise<AiBookmarkOutput> {
  const { url, pageText, microlinkDescription, existingTags, existingCategories } = input

  const tagVocabulary =
    existingTags.length > 0
      ? `Existing tag vocabulary: ${existingTags.join(", ")}. Prefer reusing existing tags when they fit.`
      : ""

  const categoryVocabulary =
    existingCategories.length > 0
      ? `Existing categories: ${existingCategories.join(", ")}. Strongly prefer reusing one of these. Only invent a new kebab-case category slug if none of the existing ones is a reasonable fit.`
      : `No categories exist yet — invent a concise kebab-case slug for this resource (e.g. "dev-tools", "design", "ai-productivity").`

  const result = await generateObject({
    model: anthropic("claude-sonnet-4-6"),
    temperature: 0.2,
    schema: aiBookmarkSchema,
    schemaName: "AiBookmarkOutput",
    schemaDescription:
      "AI-generated metadata for a bookmarked developer tool or resource.",
    prompt: [
      `Analyze the following web page and generate structured metadata for it.`,
      ``,
      `URL: ${url}`,
      `Description: ${microlinkDescription}`,
      ``,
      `Page text:`,
      `${pageText}`,
      ``,
      categoryVocabulary,
      tagVocabulary,
      ``,
      `Instructions:`,
      `- category: a single kebab-case slug. Reuse an existing category when one fits; only invent a new one if none does.`,
      `- Generate 1-5 relevant tags as lowercase keywords.`,
      `- Write 2-4 short pro bullets (factual strengths, ~80 chars each).`,
      `- Write 0-4 short con bullets (factual weaknesses, ~80 chars each). If none apply, return an empty array.`,
      `- Write a neutral aiSummary of ~60 words: 2-3 sentences, no first-person, no superlatives.`,
    ].join("\n"),
  })

  return {
    ...result.object,
    category: result.object.category.toLowerCase(),
    tags: result.object.tags.map((t) => t.trim().toLowerCase()),
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
