import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/config"

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
