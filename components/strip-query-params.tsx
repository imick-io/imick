"use client"

import { useEffect } from "react"

// Removes the query string from the address bar without a navigation.
// Used on the newsletter confirmation page, where Beehiiv's opt-in redirect
// appends a subscriber jwt_token that must not linger in history or logs.
export function StripQueryParams() {
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname)
    }
  }, [])

  return null
}
