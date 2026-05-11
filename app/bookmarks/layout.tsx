import { NuqsAdapter } from "nuqs/adapters/next/app"

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
