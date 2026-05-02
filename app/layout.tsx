import type { Metadata } from "next"
import { Geist, Geist_Mono, Figtree } from "next/font/google"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon } from "@hugeicons/core-free-icons"
import { ThemeProvider } from "@/components/theme-provider"
import { NavLink } from "@/components/nav-link"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import "./globals.css"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        figtree.variable,
        geistSans.variable,
        geistMono.variable
      )}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b bg-background/80 backdrop-blur-sm">
            <Link href="/" className="font-semibold text-foreground hover:opacity-80 transition-opacity">
              {siteConfig.handle}
            </Link>
            <nav className="flex items-center gap-6">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/learn">Learn</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <a
                href={siteConfig.githubSponsorsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Sponsors"
                className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
              >
                <HugeiconsIcon icon={GithubIcon} size={18} />
              </a>
            </nav>
          </header>
          <main className="flex flex-col flex-1">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
