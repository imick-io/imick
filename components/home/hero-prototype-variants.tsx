// PROTOTYPE -- throwaway. Three hero rails for the home page, switchable via ?variant=.
// Question: what are the new hero headline, subline, and site description now that the
// site's job is audience building around a person (issue #58) and the newsletter is the
// primary action (issue #59)?
// Each variant owns its whole rail. No shared layout on purpose. Delete once one wins.

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { SubscribeForm } from "@/components/subscribe-form"
import { siteConfig } from "@/lib/config"

const PROMISE =
  "Every other Tuesday, a short letter about what I am building, reading, and cooking."

const railBase =
  "flex flex-col gap-8 lg:sticky lg:top-24 lg:h-fit lg:self-start motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"

/* ------------------------------------------------------------------ */
/* A -- Person first. Headline carries the person, newsletter is the   */
/*      primary block, everything else is a quiet link.                */
/* ------------------------------------------------------------------ */

export function VariantA() {
  return (
    <aside className={railBase}>
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {siteConfig.name} · Montreal
        </p>
        <h1 className="font-heading text-4xl font-normal leading-[1.05] tracking-[-0.015em] text-balance md:text-5xl">
          I build things, and I write down <em className="italic">what actually happened</em>.
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Product engineer. I ship products start to finish, think out loud about the
          career around it, and optimize everything else I touch. Everything I learn lands
          here.
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-muted/60 p-5">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          The letter
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">{PROMISE}</p>
        <div className="pt-1">
          <SubscribeForm source="home" variant="compact" />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <Link
          href="/about"
          className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
        >
          More about me
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Get in touch
        </Link>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* B -- Letter first. The newsletter promise IS the headline. Identity */
/*      sits underneath as a short bio. Inverted hierarchy.            */
/* ------------------------------------------------------------------ */

export function VariantB() {
  return (
    <aside className={railBase}>
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          The letter
        </p>
        <h1 className="font-heading text-4xl font-normal leading-[1.05] tracking-[-0.015em] text-balance md:text-5xl">
          What I am building, and what it is <em className="italic">teaching me</em>.
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Every other Tuesday. Short enough to read with a coffee, including the parts that
          are not working.
        </p>
        <SubscribeForm source="home" variant="full" />
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Who is writing
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {siteConfig.name}, product engineer in Montreal. I build products start to
          finish, most recently on an open-source AI product at volume. I write about the
          work, the career around it, and the systems I run the rest of my life on.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/about"
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            More about me
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Link>
          <Link
            href="/contact"
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* C -- Subject led. The five subjects are the structure, so breadth   */
/*      is shown rather than explained. Newsletter closes the rail.    */
/* ------------------------------------------------------------------ */

const SUBJECTS: { label: string; note: string; href: string }[] = [
  { label: "Building", note: "products, start to finish", href: "/learn/articles" },
  { label: "The career", note: "craft, focus, and the long game", href: "/about" },
  { label: "Cooking", note: "29 recipes and counting", href: "/cooking" },
  { label: "Bookmarks", note: "what I use and what I want to try", href: "/bookmarks" },
]

export function VariantC() {
  return (
    <aside className={railBase}>
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {siteConfig.name} · Montreal
        </p>
        <h1 className="font-heading text-4xl font-normal leading-[1.05] tracking-[-0.015em] text-balance md:text-5xl">
          I optimize <em className="italic">everything</em>, and I write all of it down.
        </h1>
      </div>

      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {SUBJECTS.map((subject) => (
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
        <p className="text-sm leading-relaxed text-muted-foreground">{PROMISE}</p>
        <div className="pt-1">
          <SubscribeForm source="home" variant="compact" />
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <Link
          href="/about"
          className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
        >
          More about me
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Link>
        <Link
          href="/contact"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Get in touch
        </Link>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* siteConfig candidates, one per variant. Not wired up; here so the   */
/* meta copy is judged alongside the hero it belongs to.               */
/* ------------------------------------------------------------------ */

export const SITE_CONFIG_CANDIDATES = {
  A: {
    role: "Product Engineer",
    tagline: "I build things, and I write down what actually happened.",
    description:
      "Michael Boutin builds products start to finish and writes about the work, the career around it, and everything else he optimizes.",
  },
  B: {
    role: "Product Engineer",
    tagline: "What I am building, and what it is teaching me. Every other Tuesday.",
    description:
      "A letter every other Tuesday from Michael Boutin, product engineer: what he is building, what he is reading, and what the work is teaching him.",
  },
  C: {
    role: "Product Engineer",
    tagline: "I optimize everything, and I write all of it down.",
    description:
      "Michael Boutin on building products with AI, the career around it, and the systems that make the rest of it work. Written down as it happens.",
  },
} as const
