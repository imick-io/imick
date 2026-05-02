import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InformationCircleIcon,
  Alert02Icon,
  BulbIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type CalloutType = "info" | "warn" | "tip" | "danger"

const styles: Record<CalloutType, { wrapper: string; icon: string; iconKey: typeof InformationCircleIcon }> = {
  info: {
    wrapper: "border-blue-500/30 bg-blue-500/5 text-foreground",
    icon: "text-blue-500",
    iconKey: InformationCircleIcon,
  },
  warn: {
    wrapper: "border-amber-500/40 bg-amber-500/5 text-foreground",
    icon: "text-amber-500",
    iconKey: Alert02Icon,
  },
  tip: {
    wrapper: "border-emerald-500/30 bg-emerald-500/5 text-foreground",
    icon: "text-emerald-500",
    iconKey: BulbIcon,
  },
  danger: {
    wrapper: "border-destructive/40 bg-destructive/10 text-foreground",
    icon: "text-destructive",
    iconKey: AlertCircleIcon,
  },
}

type CalloutProps = {
  type?: CalloutType
  title?: string
  children: ReactNode
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const variant = styles[type]
  return (
    <aside
      className={cn(
        "my-6 flex gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed",
        variant.wrapper
      )}
    >
      <HugeiconsIcon
        icon={variant.iconKey}
        size={18}
        className={cn("mt-0.5 shrink-0", variant.icon)}
      />
      <div className="flex flex-col gap-1 [&_p]:m-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
    </aside>
  )
}
