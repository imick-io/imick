import type { ReactNode } from "react"
import { IconTools } from "@tabler/icons-react"

// Inline notice for sections still being built. Accent-pale tint per the
// design system's single-accent discipline.
export function UnderDevelopmentNotice({ children }: { children?: ReactNode }) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm"
    >
      <IconTools className="size-4 shrink-0 text-primary" aria-hidden />
      <p>
        {children ??
          "This section is under active development. Expect rough edges."}
      </p>
    </div>
  )
}
