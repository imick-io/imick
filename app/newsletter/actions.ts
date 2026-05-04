"use server"

import { subscribeSchema } from "@/lib/subscribe-schema"

export type SubscribeResult =
  | { ok: true; status: "pending" | "existing" }
  | { ok: false; error: string }

const GENERIC_ERROR =
  "Subscription temporarily unavailable. Please try again in a moment."

export async function subscribeToNewsletter(input: unknown): Promise<SubscribeResult> {
  const parsed = subscribeSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Please enter a valid email address." }
  }

  const { email, source, honeypot } = parsed.data

  if (honeypot && honeypot.trim().length > 0) {
    return { ok: true, status: "pending" }
  }

  const apiKey = process.env.BEEHIIV_API_KEY
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID
  if (!apiKey || !publicationId) {
    console.error("Beehiiv env vars missing", {
      hasApiKey: Boolean(apiKey),
      hasPublicationId: Boolean(publicationId),
    })
    return { ok: false, error: GENERIC_ERROR }
  }

  const url = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        utm_source: source,
        reactivate_existing: false,
        send_welcome_email: false,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      const body = await response.text()
      console.error("Beehiiv API error", {
        status: response.status,
        body,
        source,
      })
      return { ok: false, error: GENERIC_ERROR }
    }

    const json: unknown = await response.json()
    const subscriberStatus = extractSubscriptionStatus(json)

    if (subscriberStatus === "active") {
      return { ok: true, status: "existing" }
    }

    return { ok: true, status: "pending" }
  } catch (err) {
    console.error("Beehiiv request failed", err)
    return { ok: false, error: GENERIC_ERROR }
  }
}

function extractSubscriptionStatus(json: unknown): string | undefined {
  if (typeof json !== "object" || json === null) return undefined
  const data = (json as { data?: unknown }).data
  if (typeof data !== "object" || data === null) return undefined
  const status = (data as { status?: unknown }).status
  return typeof status === "string" ? status : undefined
}
