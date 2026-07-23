import { NuqsAdapter } from "nuqs/adapters/next/app"

export default function CookingLayout({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
