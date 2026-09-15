import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"
import { buttonVariants } from "@/components/ui/button"
import { resumeLabels, resumePdfPathByLocale } from "@/lib/resume-content"
import type { ResumeLocale } from "@/lib/resume-content"

export function ResumePdfButton({ locale = "en" }: { locale?: ResumeLocale }) {
  return (
    <a
      href={resumePdfPathByLocale[locale]}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonVariants({ size: "sm" })} fixed right-4 top-4 z-50 print:hidden`}
    >
      <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
      {resumeLabels[locale].downloadPdf}
    </a>
  )
}
