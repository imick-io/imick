import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { SubscribeForm } from "@/components/subscribe-form"
import { siteConfig } from "@/lib/config"

const newsletterDescription = `Notes on shipping software — pragmatic engineering, product, and the path from idea to production. From ${siteConfig.name}.`

const SOCIAL_PROOF_THRESHOLD = 100

const valueProps = [
  "One issue, every other Tuesday — short enough to read with a coffee.",
  "A mix of engineering deep-dives, product notes, and what I'm actually building.",
  "Highlights from the Learn section before they make it to the front page.",
  "No tracking pixels. No referral links. Unsubscribe in one click.",
]

export const metadata: Metadata = {
  title: "Newsletter",
  description: newsletterDescription,
  alternates: { canonical: "/newsletter" },
  openGraph: {
    type: "website",
    url: "/newsletter",
    siteName: siteConfig.handle,
    title: `Newsletter — ${siteConfig.name}`,
    description: newsletterDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `Newsletter — ${siteConfig.name}`,
    description: newsletterDescription,
  },
}

export default function NewsletterPage() {
  const showSocialProof =
    siteConfig.newsletterSubscriberMilestone >= SOCIAL_PROOF_THRESHOLD

  return (
    <div className="flex flex-col gap-12 px-6 py-16 md:gap-16 md:py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Newsletter</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Notes on shipping software.
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Engineering, product, and the path from idea to production — straight
          to your inbox, every other Tuesday.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          What you&apos;ll get
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed text-foreground/90 marker:text-muted-foreground">
          {valueProps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <SubscribeForm
          source="newsletter-page"
          variant="full"
          fineprint={
            <>
              No spam. Unsubscribe anytime. See the{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-foreground"
              >
                privacy policy
              </Link>
              .
            </>
          }
        />
        {showSocialProof ? (
          <p className="text-sm text-muted-foreground">
            Join {siteConfig.newsletterSubscriberMilestone.toLocaleString()}+
            developers reading along.
          </p>
        ) : null}
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Recent issues
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          Past issues live on the Beehiiv-hosted archive — read a few before
          you commit your inbox.
        </p>
        <a
          href={siteConfig.newsletterArchiveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 self-start text-sm font-medium text-foreground underline underline-offset-2 hover:opacity-80"
        >
          Browse the archive
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size={14}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </section>
    </div>
  )
}
