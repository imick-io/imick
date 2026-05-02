import { cn } from "@/lib/utils"

type VideoProps = {
  src: string
  title?: string
  className?: string
}

function youtubeId(src: string): string | null {
  if (/^[a-zA-Z0-9_-]{11}$/.test(src)) return src
  try {
    const url = new URL(src)
    if (url.hostname === "youtu.be") return url.pathname.slice(1) || null
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v")
      if (v) return v
      const segs = url.pathname.split("/").filter(Boolean)
      const i = segs.findIndex((s) => s === "embed" || s === "shorts")
      if (i >= 0 && segs[i + 1]) return segs[i + 1]
    }
  } catch {
    return null
  }
  return null
}

export function Video({ src, title, className }: VideoProps) {
  const id = youtubeId(src)
  if (!id) return null
  return (
    <div className={cn("my-6 overflow-hidden rounded-lg border border-border", className)}>
      <div className="relative aspect-video w-full bg-muted">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title ?? "Embedded video"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  )
}
