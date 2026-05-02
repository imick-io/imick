"use client"

import { useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type PreProps = React.HTMLAttributes<HTMLPreElement>

export function CodeBlock({ className, children, ...props }: PreProps) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const text = ref.current?.innerText ?? ""
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore clipboard failure
    }
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-border bg-muted/40">
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={cn(
          "absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100"
        )}
      >
        <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={14} />
      </button>
      <pre
        ref={ref}
        className={cn(
          "overflow-x-auto px-4 py-4 text-sm leading-relaxed font-mono [&_code]:bg-transparent [&_code]:p-0",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
