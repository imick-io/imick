"use client"

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  type ReactNode,
} from "react"
import { slugify, type Heading } from "@/lib/mdx-helpers"

type Tracker = { index: number }

const HeadingsContext = createContext<{ headings: Heading[]; tracker: Tracker } | null>(null)

export function HeadingsProvider({
  headings,
  children,
}: {
  headings: Heading[]
  children: ReactNode
}) {
  const value: { headings: Heading[]; tracker: Tracker } = {
    headings,
    tracker: { index: 0 },
  }
  return <HeadingsContext.Provider value={value}>{children}</HeadingsContext.Provider>
}

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join("")
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return nodeText(node.props.children)
  }
  return ""
}

function makeHeading(Tag: "h2" | "h3", depth: 2 | 3) {
  return function Heading({
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    const ctx = useContext(HeadingsContext)
    const text = Children.toArray(children).map(nodeText).join("")
    let computed = id

    if (!computed && ctx) {
      while (ctx.tracker.index < ctx.headings.length) {
        const candidate = ctx.headings[ctx.tracker.index]
        ctx.tracker.index += 1
        if (candidate.depth === depth && candidate.text === text) {
          computed = candidate.id
          break
        }
      }
    }
    if (!computed) computed = slugify(text)

    return (
      <Tag id={computed} {...props}>
        {children}
      </Tag>
    )
  }
}

export const HeadingWithId = {
  h2: makeHeading("h2", 2),
  h3: makeHeading("h3", 3),
}
