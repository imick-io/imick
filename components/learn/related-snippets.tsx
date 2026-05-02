import { type Snippet } from "content-collections"
import { SnippetCard } from "@/components/learn/snippet-card"

type Props = {
  snippets: Array<Snippet & { isDraft: boolean }>
}

export function RelatedSnippets({ snippets }: Props) {
  if (snippets.length === 0) return null
  return (
    <section
      aria-labelledby="related-snippets-heading"
      className="mx-auto flex w-full max-w-3xl flex-col gap-5"
    >
      <h2 id="related-snippets-heading" className="text-xl font-semibold tracking-tight">
        Related snippets
      </h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {snippets.map((snippet) => (
          <li key={snippet.slug}>
            <SnippetCard snippet={snippet} />
          </li>
        ))}
      </ul>
    </section>
  )
}
