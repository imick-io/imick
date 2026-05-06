import type { Metadata } from "next"
import { Geist, Geist_Mono, Figtree } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteFooter } from "@/components/site-footer"
import SimpleNavbarWithHoverEffects from "@/block/simple-navbar-with-hover-effects"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
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
