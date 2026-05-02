"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  NewTwitterIcon,
  Linkedin01Icon,
  Link01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { siteConfig } from "@/lib/config"

type Props = {
  title: string
  url: string
}

export function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false)
  const absoluteUrl = url.startsWith("http") ? url : `${siteConfig.url}${url}`

  const xHref = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(absoluteUrl)}`
  const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl)}`

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore clipboard failure
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">Share</span>
      <a
        href={xHref}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Share on X"
        className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={NewTwitterIcon} size={14} />
      </a>
      <a
        href={liHref}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Share on LinkedIn"
        className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={Linkedin01Icon} size={14} />
      </a>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
        className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={copied ? Tick02Icon : Link01Icon} size={14} />
      </button>
    </div>
  )
}
