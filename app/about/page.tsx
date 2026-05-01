import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Michael Boutin — full-stack engineer, open-source contributor, and content creator.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted-foreground text-sm">About — coming in Phase 3</p>
    </div>
  )
}
