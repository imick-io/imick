import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { ResumeDocument } from "@/components/resume-document"
import { ResumeGateFormInline } from "@/components/resume-gate-form-inline"
import { ResumePdfButton } from "@/components/resume-pdf-button"
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-muted print:static print:overflow-visible print:bg-background">
      {/* {session ? <GatedResume /> : <GateOverlay />} */}
      <GatedResume />
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
    <div className="relative min-h-full pb-12">
      <Link
        href="/"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:text-foreground print:hidden"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} />
        Back to {siteConfig.handle}
      </Link>
      <ResumePdfButton />
      <div className="mx-auto w-full max-w-5xl px-4 pt-16 print:max-w-none print:px-0 print:pt-0">
        <ResumeDocument />
      </div>
    </div>
  )
}
