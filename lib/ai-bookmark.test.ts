import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGenerateObject } = vi.hoisted(() => ({
  mockGenerateObject: vi.fn(),
}))

vi.mock("ai", () => ({ generateObject: mockGenerateObject }))

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(() => "mocked-model"),
}))

import { generateBookmarkAi, mergeAiFields, type AiBookmarkOutput } from "./ai-bookmark"

const validInput = {
  url: "https://example.com/tool",
  pageText: "This is a great developer tool for building web apps.",
  microlinkDescription: "A modern web development toolkit",
  existingTags: ["typescript", "react", "testing"],
  existingCategories: ["dev-tools", "design", "learning"],
}

const validAiOutput = {
  category: "dev-tools",
  tags: ["TypeScript", " React "],
  pros: ["Fast build times", "Great documentation"],
  cons: ["Steep learning curve"],
  aiSummary:
    "A modern developer tool that streamlines web application development with a focus on type safety and component architecture.",
  suggestedCategory: null,
}

beforeEach(() => {
  mockGenerateObject.mockReset()
})

describe("generateBookmarkAi", () => {
  it("returns the parsed shape with normalized tags on a valid response", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: validAiOutput })

    const result = await generateBookmarkAi(validInput)

    expect(result).toEqual({
      category: "dev-tools",
      tags: ["typescript", "react"],
      pros: ["Fast build times", "Great documentation"],
      cons: ["Steep learning curve"],
      aiSummary: validAiOutput.aiSummary,
      suggestedCategory: null,
    })
  })

  it("propagates a non-null suggestedCategory through unchanged", async () => {
    mockGenerateObject.mockResolvedValueOnce({
      object: { ...validAiOutput, suggestedCategory: "ai-productivity" },
    })

    const result = await generateBookmarkAi(validInput)

    expect(result.suggestedCategory).toBe("ai-productivity")
  })

  it("throws when generateObject rejects (malformed response)", async () => {
    mockGenerateObject.mockRejectedValueOnce(
      new Error("Failed to parse structured output")
    )

    await expect(generateBookmarkAi(validInput)).rejects.toThrow(
      "Failed to parse structured output"
    )
  })

  it("includes URL, microlink description, existing tags, and existing categories in the prompt", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: validAiOutput })

    await generateBookmarkAi(validInput)

    const call = mockGenerateObject.mock.calls[0][0]

    expect(call.prompt).toContain(validInput.url)
    expect(call.prompt).toContain(validInput.microlinkDescription)
    expect(call.prompt).toContain("typescript")
    expect(call.prompt).toContain("react")
    expect(call.prompt).toContain("testing")
    expect(call.prompt).toContain("dev-tools")
    expect(call.prompt).toContain("design")
    expect(call.prompt).toContain("learning")
  })

  it("sets temperature to approximately 0.2", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: validAiOutput })

    await generateBookmarkAi(validInput)

    const call = mockGenerateObject.mock.calls[0][0]
    expect(call.temperature).toBeCloseTo(0.2, 1)
  })
})

describe("mergeAiFields", () => {
  const aiOutput: AiBookmarkOutput = {
    category: "ai-productivity",
    tags: ["ai", "productivity"],
    pros: ["Great AI features", "Easy to use"],
    cons: ["Expensive"],
    aiSummary: "An AI productivity tool.",
  }

  const fullExisting = {
    category: "dev-tools",
    tags: ["react", "typescript"],
    pros: ["Fast", "Reliable"],
    cons: ["Complex setup"],
    aiSummary: "A dev tool for building apps.",
  }

  const emptyExisting = {
    category: null,
    tags: [] as string[],
    pros: [] as string[],
    cons: [] as string[],
    aiSummary: null,
  }

  it("overwrites all five fields when force is true", () => {
    const result = mergeAiFields(fullExisting, aiOutput, true)
    expect(result).toEqual({
      category: aiOutput.category,
      tags: aiOutput.tags,
      pros: aiOutput.pros,
      cons: aiOutput.cons,
      aiSummary: aiOutput.aiSummary,
    })
  })

  it("fills only empty fields when force is false", () => {
    const result = mergeAiFields(emptyExisting, aiOutput, false)
    expect(result.tags).toEqual(aiOutput.tags)
    expect(result.pros).toEqual(aiOutput.pros)
    expect(result.cons).toEqual(aiOutput.cons)
    expect(result.aiSummary).toBe(aiOutput.aiSummary)
  })

  it("fills category from AI when existing is null (non-force mode)", () => {
    const result = mergeAiFields(emptyExisting, aiOutput, false)
    expect(result.category).toBe(aiOutput.category)
  })

  it("preserves existing category when set (non-force mode)", () => {
    const result = mergeAiFields(fullExisting, aiOutput, false)
    expect(result.category).toBe(fullExisting.category)
  })

  it("preserves all populated fields when force is false", () => {
    const result = mergeAiFields(fullExisting, aiOutput, false)
    expect(result).toEqual({
      category: fullExisting.category,
      tags: fullExisting.tags,
      pros: fullExisting.pros,
      cons: fullExisting.cons,
      aiSummary: fullExisting.aiSummary,
    })
  })

  it("treats tags with length > 0 as non-empty", () => {
    const partial = { ...emptyExisting, tags: ["existing-tag"] }
    const result = mergeAiFields(partial, aiOutput, false)
    expect(result.tags).toEqual(["existing-tag"])
  })

  it("fills aiSummary when existing is null", () => {
    const result = mergeAiFields(emptyExisting, aiOutput, false)
    expect(result.aiSummary).toBe(aiOutput.aiSummary)
  })

  it("preserves aiSummary when existing is non-null", () => {
    const result = mergeAiFields(fullExisting, aiOutput, false)
    expect(result.aiSummary).toBe(fullExisting.aiSummary)
  })

  it("never includes rating or reviewText in the result", () => {
    const forceResult = mergeAiFields(fullExisting, aiOutput, true)
    const nonForceResult = mergeAiFields(fullExisting, aiOutput, false)
    expect(forceResult).not.toHaveProperty("rating")
    expect(forceResult).not.toHaveProperty("reviewText")
    expect(nonForceResult).not.toHaveProperty("rating")
    expect(nonForceResult).not.toHaveProperty("reviewText")
  })
})
