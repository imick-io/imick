import Link from "next/link"
import { type Snippet } from "content-collections"
import { formatPostDate } from "@/lib/posts"

type SnippetCardProps = {
  snippet: Snippet & { isDraft: boolean }
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Link
      href={`/learn/snippets/${snippet.slug}`}
      className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {snippet.language}
        </span>
        {snippet.isDraft ? (
          <span className="rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
            DRAFT
          </span>
        ) : null}
      </div>
      <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:underline">
        {snippet.title}
      </h3>
      {snippet.description ? (
        <p className="text-sm text-muted-foreground">{snippet.description}</p>
      ) : null}
      {snippet.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {snippet.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto pt-2 text-xs text-muted-foreground">
        {formatPostDate(snippet.publishedAt) || "Unscheduled"}
      </div>
    </Link>
  )
}
