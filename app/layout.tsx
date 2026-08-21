import type { Metadata } from "next"
import { Manrope, Inter, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteBackdrop } from "@/components/site-backdrop"
import { SiteFooter } from "@/components/site-footer"
import SimpleNavbarWithHoverEffects from "@/block/simple-navbar-with-hover-effects"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import "./globals.css"

// Body Sans: Inter at 400/600 (DESIGN.md body scale).
const inter = Inter({
  weight: ["400", "600"],
  variable: "--font-sans",
  subsets: ["latin"],
})

// Display Sans: Manrope. 400/600 for utility headings, 800/900 for display moments.
const manrope = Manrope({
  weight: ["400", "600", "800"],
  variable: "--font-display",
  subsets: ["latin"],
})

// Geist Mono retained for code surfaces.
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
        "h-full font-sans antialiased",
        inter.variable,
        manrope.variable,
        geistMono.variable
      )}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <SiteBackdrop />
          <SimpleNavbarWithHoverEffects />
          <main className="flex flex-col flex-1">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
