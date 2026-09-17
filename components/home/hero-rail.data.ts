import { siteConfig } from "@/lib/config"

export type HeroSubject = { label: string; note: string; href: string }

export type HeroLink = { label: string; href: string }

export const heroSubjects: HeroSubject[] = [
  { label: "Building", note: "products, start to finish", href: "/learn/articles" },
  { label: "The career", note: "craft, focus, and the long game", href: "/about" },
  { label: "Cooking", note: "29 recipes and counting", href: "/cooking" },
  { label: "Bookmarks", note: "what I use and what I want to try", href: "/bookmarks" },
]

export const heroEyebrow = `${siteConfig.name} · Montreal`

export const heroHeadline = siteConfig.tagline

export const heroLetterPromise =
  "Every other Tuesday, a short letter about what I am building, reading, and cooking."

export const heroLinks: { primary: HeroLink; muted: HeroLink } = {
  primary: { label: "More about me", href: "/about" },
  muted: { label: "Get in touch", href: "/contact" },
}
