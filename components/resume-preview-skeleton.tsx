export function ResumePreviewSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12"
    >
      <div className="flex flex-col gap-3">
        <div className="h-7 w-1/3 rounded bg-muted" />
        <div className="h-4 w-1/4 rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-11/12 rounded bg-muted" />
        <div className="h-3 w-10/12 rounded bg-muted" />
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-5 w-1/3 rounded bg-muted" />
          <div className="h-3 w-1/4 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-11/12 rounded bg-muted" />
          <div className="h-3 w-9/12 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}
