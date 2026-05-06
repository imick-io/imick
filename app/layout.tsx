import type { Metadata } from "next"
import { Geist, Geist_Mono, Figtree } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon } from "@hugeicons/core-free-icons"
import { ThemeProvider } from "@/components/theme-provider"
import { NavLink } from "@/components/nav-link"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import avatar from "@/assets/avatar.webp"
import "./globals.css"

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'})

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
              geistSans.variable,
              geistMono.variable
            , "font-sans", figtree.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b bg-background/80 backdrop-blur-sm">
            <Link
              href="/"
              aria-label={`${siteConfig.handle} home`}
              className="inline-flex items-center transition-opacity hover:opacity-80"
            >
              <Image
                src={avatar}
                alt={siteConfig.name}
                width={36}
                height={36}
                priority
                className="size-9 rounded-full"
              />
            </Link>
            <nav className="flex items-center gap-6">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/learn">Learn</NavLink>
              <NavLink href="/newsletter">Newsletter</NavLink>
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
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
