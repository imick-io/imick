"use server"

import { Resend } from "resend"
import { createAnonymousSessionFromForm } from "@/lib/anonymous-session"
import { recordFormSubmission } from "@/lib/form-submissions"
import {
  intentionOptions,
  resumeGateSchema,
  type ResumeGateInput,
} from "@/lib/resume-gate-schema"

type Result = { ok: true } | { ok: false; error: string }

function intentionLabel(value: ResumeGateInput["intention"]) {
  return intentionOptions.find((o) => o.value === value)?.label ?? value
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function submitResumeAccess(input: unknown): Promise<Result> {
  const parsed = resumeGateSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." }
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !fromEmail) {
    return { ok: false, error: "Email is not configured. Please try again later." }
  }

  const data = parsed.data
  const intention = intentionLabel(data.intention)
  const subject = `Resume access requested by ${data.fullName} (${intention})`

  const text = [
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Company: ${data.company}`,
    `LinkedIn: ${data.linkedin ?? "n/a"}`,
    `Intention: ${intention}`,
  ].join("\n")

  const html = `
    <h2>New resume access request</h2>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(data.fullName)}</li>
      <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
      <li><strong>Company:</strong> ${escapeHtml(data.company)}</li>
      <li><strong>LinkedIn:</strong> ${data.linkedin ? escapeHtml(data.linkedin) : "n/a"}</li>
      <li><strong>Intention:</strong> ${escapeHtml(intention)}</li>
    </ul>
  `.trim()

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: fromEmail,
      replyTo: data.email,
      subject,
      text,
      html,
    })
    if (error) {
      console.error("Resend error", error)
      return { ok: false, error: "Could not send notification. Please try again." }
    }
  } catch (err) {
    console.error("Resend exception", err)
    return { ok: false, error: "Could not send notification. Please try again." }
  }

  const session = await createAnonymousSessionFromForm({
    source: "resume_gate",
    name: data.fullName,
    email: data.email,
    company: data.company,
    linkedinUrl: data.linkedin,
  })
  if (!session.ok) {
    return { ok: false, error: session.error }
  }

  const recorded = await recordFormSubmission({
    userId: session.userId,
    source: "resume_gate",
    payload: { intention: data.intention },
  })
  if (!recorded.ok) {
    return { ok: false, error: recorded.error }
  }

  return { ok: true }
}
