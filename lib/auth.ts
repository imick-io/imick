import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { magicLink } from "better-auth/plugins"
import { Resend } from "resend"
import { db } from "./db"
import { user, session, account, verification } from "./db/schema"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (email !== process.env.ADMIN_EMAIL) return
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) {
          console.error("RESEND_API_KEY not set — cannot send magic link")
          return
        }
        const resend = new Resend(apiKey)
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "noreply@imick.io",
          to: email,
          subject: "Sign in to imick.io",
          html: `<p>Click to sign in to imick.io admin:</p><p><a href="${url}">${url}</a></p><p>This link expires in 5 minutes.</p>`,
        })
      },
    }),
  ],
})
