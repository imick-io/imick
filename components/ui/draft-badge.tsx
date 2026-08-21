// Badge for unpublished content in non-production views (missing or
// future-dated publishedAt). Same treatment everywhere a draft can appear.
export function DraftBadge() {
  return (
    <span className="shrink-0 rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
      DRAFT
    </span>
  )
}
