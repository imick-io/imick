"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setError("")

    const { error: authError } = await authClient.signIn.magicLink({
      email,
      callbackURL: "/admin/bookmarks",
    })

    if (authError) {
      setStatus("error")
      setError(authError.message ?? "Something went wrong. Please try again.")
    } else {
      setStatus("sent")
    }
  }

  if (status === "sent") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-sm w-full text-center space-y-3">
          <h1 className="text-2xl font-semibold">Check your email</h1>
          <p className="text-muted-foreground text-sm">
            A sign-in link was sent to <strong>{email}</strong>. Click it to access admin.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Admin sign in</h1>
          <p className="text-muted-foreground text-sm">Enter your email to receive a magic link.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={status === "loading"}
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send magic link"}
        </Button>
      </form>
    </div>
  )
}
