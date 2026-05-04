"use client"

import { useId, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { subscribeToNewsletter } from "@/app/newsletter/actions"
import {
  subscribeClientSchema,
  type SubscribeSource,
} from "@/lib/subscribe-schema"
import { cn } from "@/lib/utils"

type Variant = "full" | "compact"

type SubmissionState =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "existing" }
  | { kind: "error"; message: string }

export interface SubscribeFormProps {
  source: SubscribeSource
  variant?: Variant
  className?: string
  emailLabel?: string
  submitLabel?: string
}

export function SubscribeForm({
  source,
  variant = "full",
  className,
  emailLabel = "Email",
  submitLabel = "Subscribe",
}: SubscribeFormProps) {
  const emailId = useId()
  const honeypotId = useId()
  const [isPending, startTransition] = useTransition()
  const [emailError, setEmailError] = useState<string | null>(null)
  const [state, setState] = useState<SubmissionState>({ kind: "idle" })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const honeypot = String(formData.get("company_website") ?? "")

    const parsed = subscribeClientSchema.safeParse({ email })
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please enter a valid email address."
      setEmailError(message)
      return
    }

    setEmailError(null)
    startTransition(async () => {
      const result = await subscribeToNewsletter({
        email: parsed.data.email,
        source,
        honeypot,
      })
      if (result.ok) {
        setState({ kind: result.status })
        return
      }
      setState({ kind: "error", message: result.error })
    })
  }

  if (state.kind === "pending") {
    return (
      <SuccessMessage
        variant={variant}
        className={className}
        title="Almost done!"
        body="Check your inbox to confirm your subscription."
      />
    )
  }

  if (state.kind === "existing") {
    return (
      <SuccessMessage
        variant={variant}
        className={className}
        title="You're already on the list!"
        body="Check your inbox for past issues."
      />
    )
  }

  const isCompact = variant === "compact"
  const errorMessage = state.kind === "error" ? state.message : null

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-3",
        isCompact ? "w-full" : "w-full max-w-md",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-1.5",
          isCompact && "sm:flex-row sm:items-start sm:gap-2"
        )}
      >
        <div className={cn("flex flex-col gap-1.5", isCompact && "flex-1")}>
          <Label
            htmlFor={emailId}
            className={cn(isCompact && "sr-only")}
          >
            {emailLabel}
          </Label>
          <Input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? `${emailId}-error` : undefined}
          />
        </div>
        <Button
          type="submit"
          size={isCompact ? "default" : "lg"}
          disabled={isPending}
          className={cn(isCompact && "sm:self-stretch")}
        >
          {isPending ? "Subscribing…" : submitLabel}
        </Button>
      </div>

      {emailError ? (
        <p id={`${emailId}-error`} className="text-xs text-destructive">
          {emailError}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <Label htmlFor={honeypotId}>Company website</Label>
        <Input
          id={honeypotId}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
    </form>
  )
}

function SuccessMessage({
  variant,
  className,
  title,
  body,
}: {
  variant: Variant
  className?: string
  title: string
  body: string
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-1 rounded-lg border border-border bg-card p-4",
        variant === "full" && "p-6",
        className
      )}
    >
      <p className="text-base font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  )
}
