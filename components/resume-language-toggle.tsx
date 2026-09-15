import Link from "next/link"
import type { ResumeLocale } from "@/lib/resume-content"

const OPTIONS: { locale: ResumeLocale; label: string; href: string }[] = [
  { locale: "en", label: "EN", href: "/resume" },
  { locale: "fr", label: "FR", href: "/resume?lang=fr" },
]

export function ResumeLanguageToggle({ locale }: { locale: ResumeLocale }) {
  return (
    <nav
      aria-label="Resume language"
      className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-border bg-card p-0.5 shadow-sm print:hidden"
    >
      {OPTIONS.map((option) => {
        const active = option.locale === locale
        return (
          <Link
            key={option.locale}
            href={option.href}
            aria-current={active ? "page" : undefined}
            lang={option.locale}
            className={`rounded-sm px-2.5 py-1 text-sm transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </Link>
        )
      })}
    </nav>
  )
}
