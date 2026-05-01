import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Michael Boutin.",
}

export default function ContactPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted-foreground text-sm">Contact — coming in Phase 5</p>
    </div>
  )
}
