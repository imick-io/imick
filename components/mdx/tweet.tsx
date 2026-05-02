import { HugeiconsIcon } from "@hugeicons/react"
import { NewTwitterIcon } from "@hugeicons/core-free-icons"

type TweetProps = {
  url?: string
  id?: string
  user?: string
}

function tweetUrl({ url, id, user }: TweetProps): string | null {
  if (url) return url
  if (id) return `https://x.com/${user ?? "i"}/status/${id}`
  return null
}

export function Tweet(props: TweetProps) {
  const href = tweetUrl(props)
  if (!href) return null
  return (
    <div className="my-6 rounded-lg border border-border bg-card p-4">
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"
      >
        <HugeiconsIcon icon={NewTwitterIcon} size={16} />
        View post on X
      </a>
    </div>
  )
}
