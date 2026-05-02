"use client"

import { useRef, useState, type ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type FigureProps = React.HTMLAttributes<HTMLElement> & {
  ["data-rehype-pretty-code-figure"]?: string
}

export function CodeFigure({ className, children, ...props }: FigureProps) {
  if (props["data-rehype-pretty-code-figure"] === undefined) {
    return (
      <figure className={className} {...props}>
        {children}
      </figure>
    )
  }
  return <CodeBlockShell className={className}>{children}</CodeBlockShell>
}

function CodeBlockShell({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const pre = ref.current?.querySelector("pre")
    const text = pre?.innerText ?? ""
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore clipboard failure
    }
  }

  return (
    <figure
      ref={ref}
      data-rehype-pretty-code-figure=""
      className={cn(
        "group relative my-6 overflow-hidden rounded-lg border border-border bg-muted/40 [&_figcaption]:border-b [&_figcaption]:border-border [&_figcaption]:bg-card/60 [&_figcaption]:px-4 [&_figcaption]:py-2 [&_figcaption]:text-xs [&_figcaption]:font-mono [&_figcaption]:text-muted-foreground [&_pre]:overflow-x-auto [&_pre]:px-0 [&_pre]:py-4 [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-mono [&_pre_[data-line]]:px-4 [&_pre_[data-line][data-highlighted-line]]:border-l-2 [&_pre_[data-line][data-highlighted-line]]:border-primary [&_pre_[data-line][data-highlighted-line]]:bg-primary/5",
        className
      )}
    >
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-3 top-2 z-10 inline-flex size-8 items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100"
      >
        <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={14} />
      </button>
      {children}
    </figure>
  )
}
