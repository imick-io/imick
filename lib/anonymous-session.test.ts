import { describe, it, expect, vi, beforeEach } from "vitest"

const {
  findUserByEmail,
  createUser,
  updateUser,
  createSession,
  cookieSet,
} = vi.hoisted(() => ({
  findUserByEmail: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  createSession: vi.fn(),
  cookieSet: vi.fn(),
}))

vi.mock("next/headers", () => ({
  cookies: async () => ({ set: cookieSet }),
}))

vi.mock("@/lib/auth", () => ({
  auth: {
    $context: Promise.resolve({
      internalAdapter: {
        findUserByEmail,
        createUser,
        updateUser,
        createSession,
      },
    }),
  },
}))

const { createAnonymousSessionFromForm } = await import("./anonymous-session")

beforeEach(() => {
  findUserByEmail.mockReset()
  createUser.mockReset()
  updateUser.mockReset()
  createSession.mockReset()
  cookieSet.mockReset()
})

describe("createAnonymousSessionFromForm", () => {
  it("creates the user, session, and cookie when no user with that email exists", async () => {
    findUserByEmail.mockResolvedValue(null)
    createUser.mockResolvedValue({ id: "new-user-id" })
    createSession.mockResolvedValue({ token: "session-token-123" })

    const result = await createAnonymousSessionFromForm({
      source: "resume_gate",
      name: "Casey Recruiter",
      email: "casey@example.com",
      company: "Acme Inc.",
      linkedinUrl: "https://linkedin.com/in/casey",
    })

    expect(result).toEqual({ ok: true, userId: "new-user-id" })
    expect(createUser).toHaveBeenCalledOnce()
    const createArg = createUser.mock.calls[0]![0]
    expect(createArg).toMatchObject({
      name: "Casey Recruiter",
      email: "casey@example.com",
      isAnonymous: true,
      company: "Acme Inc.",
      linkedinUrl: "https://linkedin.com/in/casey",
    })
    expect(createSession).toHaveBeenCalledWith("new-user-id")
    expect(cookieSet).toHaveBeenCalledOnce()
    expect(cookieSet.mock.calls[0]![1]).toBe("session-token-123")
  })

  it("reuses an existing user looked up by email and creates a new session", async () => {
    findUserByEmail.mockResolvedValue({
      user: {
        id: "existing-user-id",
        email: "casey@example.com",
        name: "Casey",
        company: "Acme Inc.",
        linkedinUrl: null,
      },
      accounts: [],
    })
    createSession.mockResolvedValue({ token: "session-token-xyz" })

    const result = await createAnonymousSessionFromForm({
      source: "contact",
      name: "Casey",
      email: "casey@example.com",
    })

    expect(result).toEqual({ ok: true, userId: "existing-user-id" })
    expect(createUser).not.toHaveBeenCalled()
    expect(createSession).toHaveBeenCalledWith("existing-user-id")
    expect(cookieSet.mock.calls[0]![1]).toBe("session-token-xyz")
  })

  it("returns a typed failure when session creation throws", async () => {
    findUserByEmail.mockResolvedValue(null)
    createUser.mockResolvedValue({ id: "new-user-id" })
    createSession.mockRejectedValueOnce(new Error("adapter error"))

    const result = await createAnonymousSessionFromForm({
      source: "resume_gate",
      name: "Casey",
      email: "casey@example.com",
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeTruthy()
    }
    expect(cookieSet).not.toHaveBeenCalled()
  })
})
