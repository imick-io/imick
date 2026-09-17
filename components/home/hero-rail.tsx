import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { SubscribeForm } from "@/components/subscribe-form"
import {
  heroEyebrow,
  heroLetterPromise,
  heroLinks,
  heroSubjects,
} from "@/components/home/hero-rail.data"

export function HeroRail() {
  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:h-fit lg:self-start motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {heroEyebrow}
        </p>
        <h1 className="font-heading text-4xl font-normal leading-[1.05] tracking-[-0.015em] text-balance md:text-5xl">
          I optimize <em className="italic">everything</em>, and I write all of
          it down.
        </h1>
      </div>

      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {heroSubjects.map((subject) => (
          <li key={subject.label}>
            <Link
              href={subject.href}
              className="group flex items-baseline justify-between gap-3 py-3 transition-colors hover:text-primary"
            >
              <span className="text-sm font-medium">{subject.label}</span>
              <span className="text-right text-xs text-muted-foreground group-hover:text-primary">
                {subject.note}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Newsletter
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {heroLetterPromise}
        </p>
        <div className="pt-1">
          <SubscribeForm source="home" variant="compact" />
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <Link
          href={heroLinks.primary.href}
          className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
        >
          {heroLinks.primary.label}
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Link>
        <Link
          href={heroLinks.muted.href}
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {heroLinks.muted.label}
        </Link>
      </div>
    </aside>
  )
}
