import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/config"

const privacyDescription = `How ${siteConfig.handle} collects and processes your data, and how to unsubscribe or request deletion.`

const lastUpdated = "May 4, 2026"

export const metadata: Metadata = {
  title: "Privacy",
  description: privacyDescription,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "/privacy",
    siteName: siteConfig.handle,
    title: `Privacy — ${siteConfig.name}`,
    description: privacyDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy — ${siteConfig.name}`,
    description: privacyDescription,
  },
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-12 px-6 py-16 md:gap-16 md:py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Last updated {lastUpdated}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Privacy
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          This page explains what data {siteConfig.handle} collects, why, and how
          to opt out or request deletion. Plain English, no dark patterns.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Overview</h2>
        <p className="text-base leading-relaxed text-foreground/90">
          {siteConfig.handle} is a personal site. The only data collected is what
          you voluntarily submit through one of three forms: the newsletter
          signup, the contact form, and the resume request form. There is no
          analytics tracker, no behavioural profiling, and no advertising
          network on this site.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          What is collected
        </h2>

        <div className="flex flex-col gap-3 border-l-2 border-border pl-5">
          <h3 className="text-lg font-medium text-foreground">
            Newsletter signup
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            When you subscribe, your email address is sent to{" "}
            <a
              href="https://www.beehiiv.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Beehiiv
            </a>
            , the third-party platform that hosts and delivers the newsletter.
            A {`"`}signup source{`"`} tag (e.g. <code>newsletter-page</code>,{" "}
            <code>footer</code>, <code>post-cta</code>) is attached so I can see
            which surfaces convert best. Beehiiv handles the double opt-in
            confirmation email and every subsequent newsletter send.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-l-2 border-border pl-5">
          <h3 className="text-lg font-medium text-foreground">Contact form</h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            The contact form collects your name, email address, subject, and
            message. The submission is delivered to my inbox via{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Resend
            </a>
            , a transactional email service. Messages are not stored in any
            database — they live only in my email.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-l-2 border-border pl-5">
          <h3 className="text-lg font-medium text-foreground">
            Resume request
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            The resume gate collects your full name, email address, company,
            an optional LinkedIn URL, and the reason for your request (hiring,
            freelance, collaboration, or curiosity). The submission is
            delivered to me via{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Resend
            </a>
            . As with the contact form, no database storage is involved.
          </p>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Third-party processors
        </h2>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/90">
          <li>
            <strong className="font-medium">Beehiiv</strong> — newsletter
            hosting and delivery.{" "}
            <a
              href="https://www.beehiiv.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy policy
            </a>
            .
          </li>
          <li>
            <strong className="font-medium">Resend</strong> — transactional
            email delivery (contact form and resume request).{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy policy
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Unsubscribe and opt out
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          Every newsletter email includes an unsubscribe link in the footer.
          Clicking it removes you from the list immediately and is handled
          natively by Beehiiv. You can also email me (see below) and I will
          remove you manually.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Data deletion requests
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          To request deletion of your data — newsletter subscriber record,
          contact form submission, or resume request — email me directly at{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="underline underline-offset-2 hover:text-foreground"
          >
            {siteConfig.contactEmail}
          </a>
          . Deletion will be processed within 30 days. You can also reach me
          through the{" "}
          <Link
            href="/contact"
            className="underline underline-offset-2 hover:text-foreground"
          >
            contact form
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Contact</h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          Questions about this policy or how your data is handled? Email{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="underline underline-offset-2 hover:text-foreground"
          >
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </section>
    </div>
  )
}
