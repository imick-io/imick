import { z } from "zod"

export const subscribeSourceValues = [
  "newsletter-page",
  "footer",
  "post-cta",
  "snippet-cta",
] as const

export type SubscribeSource = (typeof subscribeSourceValues)[number]

export const subscribeSchema = z.object({
  email: z.email("Please enter a valid email address."),
  source: z.enum(subscribeSourceValues),
  honeypot: z.string().optional(),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>

export const subscribeClientSchema = subscribeSchema.pick({ email: true })
export type SubscribeClientInput = z.infer<typeof subscribeClientSchema>
