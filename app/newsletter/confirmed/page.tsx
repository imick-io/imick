import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { StripQueryParams } from "@/components/strip-query-params"
import { siteConfig } from "@/lib/config"

// Landing page for Beehiiv's double-opt-in redirect. The subscription is
// already active when the visitor arrives; Beehiiv appends a subscriber
// jwt_token to the URL, which StripQueryParams scrubs client-side. Kept out
// of search indexes since it only makes sense mid-flow.
export const metadata: Metadata = {
  title: "Subscription confirmed",
  robots: { index: false, follow: false },
}

export default function NewsletterConfirmedPage() {
  return (
    <div className="flex flex-col gap-12 px-6 py-16 md:gap-16 md:py-24">
      <StripQueryParams />

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Newsletter
        </p>
        <h1 className="font-heading text-4xl font-normal tracking-tight md:text-5xl">
          You&apos;re in.
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Subscription confirmed. The next issue of Notes on shipping software
          lands in your inbox on a Tuesday, every other week.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          While you wait
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          Past issues live on the archive, and the Learn section has the
          deep-dives that issues draw from.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <a
            href={siteConfig.newsletterArchiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 self-start text-sm font-medium text-foreground underline underline-offset-2 hover:opacity-80"
          >
            Browse the archive
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              strokeWidth={2}
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <Link
            href="/learn"
            className="inline-flex items-center self-start text-sm font-medium text-foreground underline underline-offset-2 hover:opacity-80"
          >
            Explore Learn
          </Link>
        </div>
      </section>
    </div>
  )
}
