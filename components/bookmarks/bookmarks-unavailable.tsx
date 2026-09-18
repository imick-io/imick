import { IconClockPause } from "@tabler/icons-react"

// Shown in place of the bookmark grid when the database is not answering.
// Deliberately calm and free of error vocabulary: the visitor did nothing
// wrong and there is nothing for them to retry, so the page states the
// situation and invites them back.
export function BookmarksUnavailable({
  description = "The bookmark library is briefly offline for maintenance. Everything else on the site works as usual.",
}: {
  description?: string
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/40 px-6 py-16 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10">
        <IconClockPause className="size-6 text-primary" aria-hidden />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-xl font-normal tracking-tight">
          Back shortly
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
