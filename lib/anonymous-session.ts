import { cookies } from "next/headers"
import { auth } from "./auth"

// We bypass better-auth's `/sign-in/anonymous` endpoint because it generates a
// random email and would conflict with our requirement to (a) capture the
// visitor's real email and (b) reuse an existing user row when one is already
// present with the same email. Instead we drive the internal adapter directly
// and set the session cookie ourselves.

type Source = "resume_gate" | "contact"

export type AnonymousSessionInput = {
  source: Source
  name: string
  email: string
  company?: string
  linkedinUrl?: string
}

export type AnonymousSessionResult =
  | { ok: true; userId: string }
  | { ok: false; error: string }

const SESSION_COOKIE_NAME = "better-auth.session_token"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export async function createAnonymousSessionFromForm(
  input: AnonymousSessionInput
): Promise<AnonymousSessionResult> {
  try {
    const ctx = await auth.$context
    const adapter = ctx.internalAdapter

    const existing = await adapter.findUserByEmail(input.email)
    let userId: string

    if (existing?.user) {
      userId = existing.user.id
      const updates: Record<string, string> = {}
      if (input.company !== undefined) updates.company = input.company
      if (input.linkedinUrl !== undefined) updates.linkedinUrl = input.linkedinUrl
      if (Object.keys(updates).length > 0) {
        await adapter.updateUser(userId, updates)
      }
    } else {
      const created = await adapter.createUser({
        name: input.name,
        email: input.email,
        isAnonymous: true,
        company: input.company ?? null,
        linkedinUrl: input.linkedinUrl ?? null,
      })
      userId = created.id
    }

    const session = await adapter.createSession(userId)

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
      secure: process.env.NODE_ENV === "production",
    })

    return { ok: true, userId }
  } catch (err) {
    console.error("createAnonymousSessionFromForm error", err)
    return { ok: false, error: "Could not create anonymous session." }
  }
}
