import { allClasses, type Class } from "content-collections"

export function isDraft(cls: Class): boolean {
  if (!cls.publishedAt) return true
  const parsed = new Date(cls.publishedAt).getTime()
  if (Number.isNaN(parsed)) return true
  return false
}

export function isComingSoon(cls: Class): boolean {
  if (isDraft(cls)) return false
  return new Date(cls.publishedAt!).getTime() > Date.now()
}

export function isPublished(cls: Class): boolean {
  if (isDraft(cls)) return false
  return new Date(cls.publishedAt!).getTime() <= Date.now()
}

type EnrichedClass = Class & { isDraft: boolean; isComingSoon: boolean }

export function getAllClassesForRender(): EnrichedClass[] {
  const showDrafts = process.env.NODE_ENV !== "production"
  const enriched = allClasses.map((cls) => ({
    ...cls,
    isDraft: isDraft(cls),
    isComingSoon: isComingSoon(cls),
  }))
  return enriched
    .filter((cls) => showDrafts || !cls.isDraft)
    .sort((a, b) => {
      const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return aDate - bDate
    })
}

export function getClassBySlug(slug: string): EnrichedClass | null {
  const cls = allClasses.find((c) => c.slug === slug)
  if (!cls) return null
  const draft = isDraft(cls)
  if (draft && process.env.NODE_ENV === "production") return null
  return { ...cls, isDraft: draft, isComingSoon: isComingSoon(cls) }
}

export function formatComingSoonDate(publishedAt: string | undefined): string {
  if (!publishedAt) return ""
  const date = new Date(publishedAt)
  if (Number.isNaN(date.getTime())) return ""
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const year = date.getFullYear()
  return `Coming ${month} ${year}`
}
