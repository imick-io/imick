import Link from "next/link"
import Image from "next/image"
import { type Class } from "content-collections"
import { formatComingSoonDate } from "@/lib/classes"

type ClassCardProps = {
  cls: Class & { isDraft: boolean; isComingSoon: boolean }
}

export function ClassCard({ cls }: ClassCardProps) {
  return (
    <Link
      href={`/learn/classes/${cls.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-muted/40"
    >
      {cls.coverImage ? (
        <div className="relative aspect-[1200/630] w-full overflow-hidden bg-muted">
          <Image
            src={cls.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          {cls.isComingSoon ? (
            <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Coming soon
            </span>
          ) : null}
          {cls.isDraft ? (
            <span className="rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
              DRAFT
            </span>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:underline">
          {cls.title}
        </h3>
        <p className="text-sm text-muted-foreground">{cls.tagline}</p>
        <div className="mt-auto pt-2 text-xs text-muted-foreground">
          {cls.isComingSoon
            ? formatComingSoonDate(cls.publishedAt)
            : cls.isDraft
              ? "Draft"
              : new Date(cls.publishedAt!).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
        </div>
      </div>
    </Link>
  )
}
