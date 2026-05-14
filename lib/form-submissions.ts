import { db } from "./db"
import { formSubmissions } from "./db/schema"

type Result = { ok: true } | { ok: false; error: string }

export type FormSubmissionInput =
  | {
      userId: string
      source: "resume_gate"
      payload: { intention: string }
    }
  | {
      userId: string
      source: "contact"
      payload: { subject: string; message: string }
    }

export async function recordFormSubmission(
  input: FormSubmissionInput
): Promise<Result> {
  try {
    if (input.source === "resume_gate") {
      await db.insert(formSubmissions).values({
        userId: input.userId,
        source: "resume_gate",
        intention: input.payload.intention,
        subject: null,
        message: null,
      })
    } else {
      await db.insert(formSubmissions).values({
        userId: input.userId,
        source: "contact",
        intention: null,
        subject: input.payload.subject,
        message: input.payload.message,
      })
    }
    return { ok: true }
  } catch (err) {
    console.error("recordFormSubmission error", err)
    return { ok: false, error: "Could not record form submission." }
  }
}
