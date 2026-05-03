import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: { template: "%s — Admin", default: "Admin" },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background px-6 py-3 flex items-center gap-6">
        <Link href="/admin/bookmarks" className="font-semibold text-sm">
          imick.io admin
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/admin/bookmarks" className="text-muted-foreground hover:text-foreground transition-colors">
            Bookmarks
          </Link>
          <Link href="/admin/bookmarks/new" className="text-muted-foreground hover:text-foreground transition-colors">
            + New
          </Link>
        </nav>
        <div className="ml-auto">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Public site
          </Link>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
