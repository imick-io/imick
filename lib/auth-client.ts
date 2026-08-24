"use client"

import { createAuthClient } from "better-auth/client"
import { anonymousClient, magicLinkClient } from "better-auth/client/plugins"

// No baseURL: the client targets the origin the page was served from, so
// auth requests stay same-origin on www, apex, previews, and localhost.
export const authClient = createAuthClient({
  plugins: [anonymousClient(), magicLinkClient()],
})
