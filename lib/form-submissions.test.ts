import { describe, it, expect, vi, beforeEach } from "vitest"

const { valuesFn, insertFn } = vi.hoisted(() => {
  const valuesFn = vi.fn()
  const insertFn = vi.fn(() => ({ values: valuesFn }))
  return { valuesFn, insertFn }
})

vi.mock("@/lib/db", () => ({
  db: { insert: insertFn },
}))

const { recordFormSubmission } = await import("./form-submissions")

beforeEach(() => {
  insertFn.mockClear()
  valuesFn.mockReset()
  valuesFn.mockResolvedValue(undefined)
})

describe("recordFormSubmission", () => {
  it("persists a resume_gate submission with intention and null subject/message", async () => {
    const result = await recordFormSubmission({
      userId: "user-123",
      source: "resume_gate",
      payload: { intention: "hiring" },
    })

    expect(result).toEqual({ ok: true })
    expect(insertFn).toHaveBeenCalledOnce()
    expect(valuesFn).toHaveBeenCalledWith({
      userId: "user-123",
      source: "resume_gate",
      intention: "hiring",
      subject: null,
      message: null,
    })
  })

  it("persists a contact submission with subject and message and null intention", async () => {
    const result = await recordFormSubmission({
      userId: "user-456",
      source: "contact",
      payload: { subject: "Hello", message: "Wanted to chat" },
    })

    expect(result).toEqual({ ok: true })
    expect(valuesFn).toHaveBeenCalledWith({
      userId: "user-456",
      source: "contact",
      intention: null,
      subject: "Hello",
      message: "Wanted to chat",
    })
  })

  it("returns a typed failure when the insert rejects", async () => {
    valuesFn.mockRejectedValueOnce(new Error("FK violation"))

    const result = await recordFormSubmission({
      userId: "missing-user",
      source: "resume_gate",
      payload: { intention: "curious" },
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeTruthy()
    }
  })
})
