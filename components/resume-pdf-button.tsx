import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"
import { buttonVariants } from "@/components/ui/button"

export function ResumePdfButton() {
  return (
    <a
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonVariants({ size: "sm" })} fixed right-4 top-4 z-50 print:hidden`}
    >
      <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" />
      Download PDF
    </a>
  )
}
