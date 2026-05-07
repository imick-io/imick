import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGenerateObject } = vi.hoisted(() => ({
  mockGenerateObject: vi.fn(),
}))

vi.mock("ai", () => ({ generateObject: mockGenerateObject }))

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(() => "mocked-model"),
}))

import { generateBookmarkAi } from "./ai-bookmark"

const validInput = {
  url: "https://example.com/tool",
  pageText: "This is a great developer tool for building web apps.",
  microlinkDescription: "A modern web development toolkit",
  existingTags: ["typescript", "react", "testing"],
}

const validAiOutput = {
  category: "dev-tools" as const,
  tags: ["TypeScript", " React "],
  pros: ["Fast build times", "Great documentation"],
  cons: ["Steep learning curve"],
  aiSummary:
    "A modern developer tool that streamlines web application development with a focus on type safety and component architecture.",
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
    })
  })

  it("throws when generateObject rejects (malformed response)", async () => {
    mockGenerateObject.mockRejectedValueOnce(
      new Error("Failed to parse structured output")
    )

    await expect(generateBookmarkAi(validInput)).rejects.toThrow(
      "Failed to parse structured output"
    )
  })

  it("includes URL, microlink description, and existing tags in the prompt", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: validAiOutput })

    await generateBookmarkAi(validInput)

    const call = mockGenerateObject.mock.calls[0][0]
    const promptText = JSON.stringify(call.prompt ?? call.messages ?? call.system)

    expect(promptText).toContain(validInput.url)
    expect(promptText).toContain(validInput.microlinkDescription)
    expect(promptText).toContain("typescript")
    expect(promptText).toContain("react")
    expect(promptText).toContain("testing")
  })

  it("sets temperature to approximately 0.2", async () => {
    mockGenerateObject.mockResolvedValueOnce({ object: validAiOutput })

    await generateBookmarkAi(validInput)

    const call = mockGenerateObject.mock.calls[0][0]
    expect(call.temperature).toBeCloseTo(0.2, 1)
  })
})
