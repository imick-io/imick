import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteBackdrop } from "@/components/site-backdrop"
import { SiteFooter } from "@/components/site-footer"
import SimpleNavbarWithHoverEffects from "@/block/simple-navbar-with-hover-effects"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
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
        geistSans.variable,
        geistMono.variable,
        instrumentSerif.variable
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
