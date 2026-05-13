import type { Metadata } from "next"
import Link from "next/link"
import { allFolios } from "content-collections"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/config"
import { selectedWork } from "@/lib/data/selected-work"
import { getPreviousRolesStrip } from "@/lib/previous-roles"

const HOW_I_WORK_FOLIO_SLUG = "how-i-work"

const description = `Personal site of ${siteConfig.name}. ${siteConfig.tagline}`

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name}, ${siteConfig.role}` },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.handle,
    title: `${siteConfig.name}, ${siteConfig.role}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}, ${siteConfig.role}`,
    description,
  },
}

const headline = "Senior Product Engineer. I ship at startup speed, end-to-end."
const subLine =
  "Business head, engineering hands. Structure and KPIs from CGI, then two fintech startups that went on to win: Flinks (acquired, $100M) and Zumrails ($100M+ raise). Two years senior full-stack at Takeup. I deliver across the stack: strategy, architecture, code, deploy. Powered by an AI-native workflow I built and run in production."

export default function HomePage() {
  const previousRoles = getPreviousRolesStrip()
  const howIWorkFolio = allFolios.find((folio) => folio.slug === HOW_I_WORK_FOLIO_SLUG)
  if (!howIWorkFolio) {
    throw new Error(`HomePage: missing folio "${HOW_I_WORK_FOLIO_SLUG}" in content-collections`)
  }

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:gap-28 md:py-24 lg:gap-32">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <p className="text-sm font-medium text-muted-foreground">
          {siteConfig.name}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          {headline}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          {subLine}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/contact" className={buttonVariants({ size: "lg" })}>
            Get in touch
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </Link>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <h2 className="text-sm font-medium text-muted-foreground">Selected Work</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {selectedWork.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30"
            >
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {card.summary}
              </p>
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-muted-foreground">Previous Roles</h3>
          <ul className="flex flex-wrap gap-2">
            {previousRoles.map((chip) => (
              <li
                key={chip.company}
                className="flex flex-col rounded-md border border-border bg-card px-3 py-2 text-sm"
              >
                <span className="font-medium text-foreground">{chip.company}</span>
                <span className="text-xs text-muted-foreground">{chip.role}</span>
                <span className="text-xs text-muted-foreground">{chip.outcome}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* /projects archive route is not live yet; link will resolve once that page ships. */}
        <Link
          href="/projects"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          See all projects
          <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
        </Link>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">How I Work</h2>
        <Link
          href={`/learn/folios/${howIWorkFolio.slug}`}
          className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30"
        >
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {howIWorkFolio.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {howIWorkFolio.excerpt}
          </p>
          <span className="inline-flex items-center text-sm font-medium text-foreground">
            Read the folio
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </span>
        </Link>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">About</h2>
        <p className="text-base leading-relaxed text-foreground md:text-lg">
          {siteConfig.bio}
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Have a project in mind?
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Tell me about it. I read every message.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/contact" className={buttonVariants({ size: "lg" })}>
            Get in touch
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </Link>
        </div>
      </section>
    </div>
  )
}
