export type SelectedWorkCard = {
  title: string
  summary: string
  href: string
  image?: string
}

export const selectedWork: readonly SelectedWorkCard[] = [
  {
    title: "imick.io",
    summary:
      "A case study in building this site: AI-native workflow, content collections, locked positioning.",
    // Placeholder destination until the hello-imick-io case-study rewrite ships.
    href: "/learn/articles/hello-imick-io",
  },
  {
    title: "AI workflow Folio",
    summary:
      "The methodology behind the work: principles, structure, the parts of the kit I make public.",
    // Placeholder destination until slice #30 creates the AI workflow Folio.
    href: "/learn/folios/ai-workflow",
  },
] as const
