import { HugeiconsIcon } from "@hugeicons/react"
import { Github01Icon } from "@hugeicons/core-free-icons"
import { siteConfig } from "@/lib/config"

type Props = {
  sourcePath: string
}

export function SourceLink({ sourcePath }: Props) {
  const href = `${siteConfig.repoUrl}/blob/${siteConfig.repoBranch}/${sourcePath}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      <HugeiconsIcon icon={Github01Icon} size={14} />
      View source on GitHub
    </a>
  )
}
