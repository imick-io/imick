import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { SubscribeForm } from "@/components/subscribe-form"
import { siteConfig } from "@/lib/config"

const newsletterDescription = `A short personal letter every other Tuesday about what I am building, reading, and cooking. From ${siteConfig.name}.`

const promiseLine =
  "Every other Tuesday, a short letter about what I am building, reading, and cooking."

const SOCIAL_PROOF_THRESHOLD = 100

const valueProps = [
  "One letter every other Tuesday, short enough to read with a coffee.",
  "The articles from the fortnight, plus the parts I did not publish.",
  "What I am building right now, including what is not working.",
  "What I cooked, and what went into my bookmarks.",
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
    title: `Newsletter, ${siteConfig.name}`,
    description: newsletterDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `Newsletter, ${siteConfig.name}`,
    description: newsletterDescription,
  },
}

export default function NewsletterPage() {
  const showSocialProof =
    siteConfig.newsletterSubscriberMilestone >= SOCIAL_PROOF_THRESHOLD

  return (
    <div className="flex flex-col gap-12 px-6 py-16 md:gap-16 md:py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Newsletter</p>
        <h1 className="font-heading text-4xl font-normal tracking-tight md:text-5xl">
          A letter every other Tuesday.
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          A short personal note carrying the fortnight&apos;s articles plus the
          things that never became one: what I am building, what broke, what I
          cooked, and what I bookmarked.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          What you&apos;ll get
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed text-foreground/90 marker:text-muted-foreground">
          {valueProps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <p className="text-base font-medium text-foreground">{promiseLine}</p>
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
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Recent letters
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          Past letters live on the Beehiiv-hosted archive. Read a few before you
          commit your inbox.
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
