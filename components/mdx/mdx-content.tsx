"use client"

import { MDXContent as MDXContentRenderer } from "@content-collections/mdx/react"
import { CodeFigure } from "@/components/mdx/code-block"
import { Callout } from "@/components/mdx/callout"
import { Video } from "@/components/mdx/video"
import { Tweet } from "@/components/mdx/tweet"
import { HeadingWithId, HeadingsProvider } from "@/components/mdx/heading-with-id"
import type { Heading } from "@/lib/mdx-helpers"

const components = {
  figure: CodeFigure,
  h2: HeadingWithId.h2,
  h3: HeadingWithId.h3,
  Callout,
  Video,
  Tweet,
}

export function MDXContent({ code, headings = [] }: { code: string; headings?: Heading[] }) {
  return (
    <HeadingsProvider headings={headings}>
      <MDXContentRenderer code={code} components={components} />
    </HeadingsProvider>
  )
}
