import Link from "next/link"
import { SubscribeForm } from "@/components/subscribe-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/lib/config"
import { Signature } from "@/registry/signature"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="flex flex-col gap-2 md:max-w-sm">
            <p className="text-base font-medium text-foreground">
              Stay in the loop.
            </p>
            <p className="text-sm text-muted-foreground">
              The {siteConfig.handle} newsletter. Engineering, product, and
              what I&apos;m shipping. Every other Tuesday.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:max-w-md">
            <SubscribeForm
              source="footer"
              variant="compact"
              fineprint={
                <>
                  No spam. Unsubscribe anytime.{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Privacy
                  </Link>
                  .
                </>
              }
            />
          </div>
        </div>

        <Signature
          role="img"
          aria-label={`${siteConfig.name} signature`}
          fill="currentColor"
          className="h-14 w-auto text-foreground/80 md:h-16"
        />

        <div className="flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link
                href="/about"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <a
                href="https://www.concreo.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Concreo
              </a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
