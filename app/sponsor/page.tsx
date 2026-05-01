import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { buttonVariants } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon } from "@hugeicons/core-free-icons"

export const metadata: Metadata = {
  title: "Sponsor",
  description: "Support Michael Boutin's open-source work via GitHub Sponsors.",
}

export default function SponsorPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <HugeiconsIcon icon={GithubIcon} size={40} className="text-foreground" />
        <h1 className="text-2xl font-semibold">Support my work</h1>
        <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
          If you find value in my open-source projects, articles, or tools, consider sponsoring me on GitHub.
        </p>
      </div>
      <a
        href={siteConfig.githubSponsorsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ size: "lg" })}
      >
        Sponsor on GitHub
      </a>
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Back to home
      </Link>
    </div>
  )
}
