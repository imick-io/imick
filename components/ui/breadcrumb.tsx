import Link from "next/link"
import { Fragment } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <Fragment key={`${item.label}-${idx}`}>
            {idx > 0 && <HugeiconsIcon icon={ArrowRight01Icon} size={12} />}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && "text-foreground")}>{item.label}</span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
