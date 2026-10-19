import { Fragment, type ReactNode } from "react"

import type { LabelRole } from "@/lib/skills-handbook/types"
import { cn } from "@/lib/utils"

// Label roles map onto the design system's single accent and its neutrals:
// the accent marks what waits on you, ink marks agent work, and dashed lines
// mark state the agent loop sets on its own.
export const LABEL_ROLE_CLASS: Record<LabelRole, string> = {
  human: "border-primary/40 bg-primary/10 text-primary",
  agent: "border-foreground bg-foreground text-background",
  plan: "border-border bg-secondary text-secondary-foreground",
  loop: "border-dashed border-primary/60 bg-card text-primary",
  what: "border-border bg-muted text-muted-foreground",
  park: "border-dashed border-muted-foreground/50 bg-card text-muted-foreground",
}

export function LabelChip({ role, children }: { role: LabelRole; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-pill border px-2.5 py-0.5 font-mono text-xs",
        LABEL_ROLE_CLASS[role]
      )}
    >
      {children}
    </span>
  )
}

export function Command({ children }: { children: ReactNode }) {
  return (
    <code className="whitespace-nowrap rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.8rem] text-foreground">
      {children}
    </code>
  )
}

// Text from the handbook marks code with backticks.
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">{eyebrow}</p>
      <h2 className="display-sm">{title}</h2>
      {children ? <div className="max-w-2xl text-base leading-relaxed text-muted-foreground">{children}</div> : null}
    </div>
  )
}
