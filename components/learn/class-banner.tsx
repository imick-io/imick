import Link from "next/link"
import Image from "next/image"
import { type EnrichedClass, formatClassDate } from "@/lib/classes"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

type ClassBannerProps = {
  cls: EnrichedClass
}

export function ClassBanner({ cls }: ClassBannerProps) {
  return (
    <Link
      href={`/learn/classes/${cls.slug}`}
      className="group grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground md:grid-cols-[2fr_3fr]"
    >
      {cls.coverImage ? (
        <div className="relative aspect-[1200/630] w-full overflow-hidden bg-muted md:aspect-auto md:min-h-full">
          <Image
            src={cls.coverImage}
            alt=""
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="flex aspect-[1200/630] w-full items-center justify-center bg-muted md:aspect-auto md:min-h-full">
          <span
            aria-hidden
            className="font-heading text-7xl italic text-muted-foreground/40"
          >
            {cls.title.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4 p-6 md:p-8">
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
        <h3 className="font-heading text-2xl leading-tight tracking-tight text-foreground md:text-3xl">
          {cls.title}
        </h3>
        <p className="text-base leading-relaxed text-muted-foreground">{cls.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-xs text-muted-foreground">{formatClassDate(cls)}</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            See the syllabus
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  )
}
