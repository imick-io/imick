"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

// Beehiiv's double-opt-in redirect lands on /newsletter?confirmed=1. The
// subscription is already active by then; this only surfaces the confirmation
// and cleans the marker from the URL.
export function NewsletterConfirmedToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fired = useRef(false)
  const confirmed = searchParams.get("confirmed")

  useEffect(() => {
    if (!confirmed || fired.current) return
    fired.current = true
    toast.success("Subscription confirmed", {
      description: "You're on the list. See you in your inbox on Tuesday.",
    })
    router.replace("/newsletter", { scroll: false })
  }, [confirmed, router])

  return null
}
