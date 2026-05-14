import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { PrintResumeButton } from "@/components/print-resume-button"
import { ResumeGateFormInline } from "@/components/resume-gate-form-inline"
import { ResumePreviewSkeleton } from "@/components/resume-preview-skeleton"
import { auth } from "@/lib/auth"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${siteConfig.name}.`,
  alternates: { canonical: "/resume" },
  robots: { index: false, follow: false },
}

export default async function ResumePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background print:static print:overflow-visible">
      {session ? <GatedResume /> : <GateOverlay />}
    </div>
  )
}

function GateOverlay() {
  return (
    <div className="relative min-h-full">
      <ResumePreviewSkeleton />
      <div className="absolute inset-0 flex items-start justify-center bg-background/80 px-4 py-12 backdrop-blur-sm md:items-center">
        <ResumeGateFormInline />
      </div>
    </div>
  )
}

function GatedResume() {
  return (
    <div className="relative min-h-full">
      <Link
        href="/"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground print:hidden"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} />
        Back to {siteConfig.handle}
      </Link>
      <PrintResumeButton />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-20">
        <p className="text-base text-muted-foreground">
          Resume content coming next slice.
        </p>
        <p className="text-xs text-muted-foreground print:hidden">
          Tip: use your browser Print menu to save as PDF.
        </p>
      </div>
    </div>
  )
}
