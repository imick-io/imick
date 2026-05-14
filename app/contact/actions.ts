"use server"

import { Resend } from "resend"
import { createAnonymousSessionFromForm } from "@/lib/anonymous-session"
import { contactSchema } from "@/lib/contact-schema"
import { recordFormSubmission } from "@/lib/form-submissions"

type Result = { ok: true } | { ok: false; error: string }

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function submitContactMessage(input: unknown): Promise<Result> {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." }
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !fromEmail) {
    return { ok: false, error: "Email is not configured. Please try again later." }
  }

  const data = parsed.data
  const subject = `Contact form — ${data.subject}`
  const text = [
    `From: ${data.name} <${data.email}>`,
    `Subject: ${data.subject}`,
    "",
    data.message,
  ].join("\n")

  const html = `
    <h2>New contact message</h2>
    <p><strong>From:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
    <hr />
    <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
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
      return { ok: false, error: "Could not send your message. Please try again." }
    }
  } catch (err) {
    console.error("Resend exception", err)
    return { ok: false, error: "Could not send your message. Please try again." }
  }

  const session = await createAnonymousSessionFromForm({
    source: "contact",
    name: data.name,
    email: data.email,
  })
  if (!session.ok) {
    return { ok: false, error: session.error }
  }

  const recorded = await recordFormSubmission({
    userId: session.userId,
    source: "contact",
    payload: { subject: data.subject, message: data.message },
  })
  if (!recorded.ok) {
    return { ok: false, error: recorded.error }
  }

  return { ok: true }
}
