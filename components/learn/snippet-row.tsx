import Link from "next/link"
import { type Snippet } from "content-collections"
import { formatPostDate } from "@/lib/posts"

type SnippetRowProps = {
  snippet: Snippet & { isDraft: boolean }
}

export function SnippetRow({ snippet }: SnippetRowProps) {
  return (
    <Link
      href={`/learn/snippets/${snippet.slug}`}
      className="group flex items-center justify-between gap-4 py-4"
    >
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-mono text-sm text-foreground group-hover:underline group-hover:underline-offset-4 md:text-base">
            {snippet.title}
          </span>
          {snippet.isDraft ? (
            <span className="rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              DRAFT
            </span>
          ) : null}
        </span>
        {snippet.description ? (
          <span className="hidden truncate text-sm text-muted-foreground md:block">
            {snippet.description}
          </span>
        ) : null}
      </span>
      <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono lowercase">{snippet.language}</span>
        <span aria-hidden>·</span>
        <span>{formatPostDate(snippet.publishedAt) || "Unscheduled"}</span>
      </span>
    </Link>
  )
}
