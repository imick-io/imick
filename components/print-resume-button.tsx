"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { PrinterIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

export function PrintResumeButton() {
  return (
    <Button
      type="button"
      size="sm"
      onClick={() => window.print()}
      className="fixed right-4 top-4 z-50 print:hidden"
    >
      <HugeiconsIcon icon={PrinterIcon} data-icon="inline-start" />
      Print
    </Button>
  )
}
