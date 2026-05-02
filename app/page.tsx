import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, UserIcon, Mail01Icon } from "@hugeicons/core-free-icons"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/config"
import { stack } from "@/content/data/stack"

const sectionLinks = [
  {
    href: "/about",
    title: "About",
    description: "Work history, education, and open-source highlights.",
    icon: UserIcon,
  },
  {
    href: "/contact",
    title: "Contact",
    description: "Reach out about collaboration, hiring, or just to say hello.",
    icon: Mail01Icon,
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:gap-28 md:py-24 lg:gap-32">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <p className="text-sm font-medium text-muted-foreground">{siteConfig.role}</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="text-lg text-muted-foreground md:text-xl">
          {siteConfig.tagline}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/about" className={buttonVariants({ size: "lg" })}>
            View Resume
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Get in Touch
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
        <h2 className="text-sm font-medium text-muted-foreground">Tech Stack</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[...stack]
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <li
                key={item.name}
                className="flex flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{item.category}</span>
              </li>
            ))}
        </ul>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <h2 className="text-sm font-medium text-muted-foreground">Explore</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {sectionLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground">
                    <HugeiconsIcon icon={link.icon} size={18} />
                    <span className="text-base font-medium">{link.title}</span>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
