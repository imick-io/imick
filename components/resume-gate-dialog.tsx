"use client"

import { useState, useTransition } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { submitResumeLead } from "@/app/about/actions"
import {
  intentionOptions,
  resumeGateSchema,
  type ResumeGateInput,
} from "@/lib/resume-gate-schema"

const RESUME_PATH = "/resume.pdf"

type FieldErrors = Partial<Record<keyof ResumeGateInput, string>>

function triggerDownload() {
  const link = document.createElement("a")
  link.href = RESUME_PATH
  link.download = "michael-boutin-resume.pdf"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function ResumeGateDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [intention, setIntention] = useState<ResumeGateInput["intention"] | "">("")

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setFieldErrors({})
      setSubmitError(null)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const formData = new FormData(event.currentTarget)
    const raw = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      linkedin: String(formData.get("linkedin") ?? ""),
      intention,
    }

    const parsed = resumeGateSchema.safeParse(raw)
    if (!parsed.success) {
      const errors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === "string" && !errors[key as keyof ResumeGateInput]) {
          errors[key as keyof ResumeGateInput] = issue.message
        }
      }
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    startTransition(async () => {
      const result = await submitResumeLead(parsed.data)
      if (result.ok) {
        triggerDownload()
        setOpen(false)
        setIntention("")
        return
      }
      setSubmitError(result.error)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="lg">
            <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
            Download Resume
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Download my resume</DialogTitle>
          <DialogDescription>
            A few quick details and the PDF is yours. I&apos;ll get a note so I can follow up if it&apos;s a good fit.
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              aria-invalid={fieldErrors.fullName ? true : undefined}
            />
            {fieldErrors.fullName ? (
              <p className="text-xs text-destructive">{fieldErrors.fullName}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              aria-invalid={fieldErrors.email ? true : undefined}
            />
            {fieldErrors.email ? (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              type="text"
              required
              autoComplete="organization"
              aria-invalid={fieldErrors.company ? true : undefined}
            />
            {fieldErrors.company ? (
              <p className="text-xs text-destructive">{fieldErrors.company}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="linkedin">
              LinkedIn profile URL
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              placeholder="https://www.linkedin.com/in/..."
              autoComplete="url"
              aria-invalid={fieldErrors.linkedin ? true : undefined}
            />
            {fieldErrors.linkedin ? (
              <p className="text-xs text-destructive">{fieldErrors.linkedin}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="intention">Intention</Label>
            <Select
              value={intention}
              onValueChange={(value) =>
                setIntention(value as ResumeGateInput["intention"])
              }
            >
              <SelectTrigger
                id="intention"
                className="w-full"
                aria-invalid={fieldErrors.intention ? true : undefined}
              >
                <SelectValue placeholder="What brings you here?" />
              </SelectTrigger>
              <SelectContent>
                {intentionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.intention ? (
              <p className="text-xs text-destructive">{fieldErrors.intention}</p>
            ) : null}
          </div>

          {submitError ? (
            <p className="text-sm text-destructive" role="alert">
              {submitError}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending…" : "Send & Download"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
