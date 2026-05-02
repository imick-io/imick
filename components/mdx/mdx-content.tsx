"use client"

import { MDXContent as MDXContentRenderer } from "@content-collections/mdx/react"
import { CodeBlock } from "@/components/mdx/code-block"

const components = {
  pre: CodeBlock,
}

export function MDXContent({ code }: { code: string }) {
  return <MDXContentRenderer code={code} components={components} />
}
