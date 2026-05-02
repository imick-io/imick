import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { siteConfig } from "@/lib/config"

const contactDescription = `Get in touch with ${siteConfig.name} about hiring, collaboration, or anything else.`

export const metadata: Metadata = {
  title: "Contact",
  description: contactDescription,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    siteName: siteConfig.handle,
    title: `Contact ${siteConfig.name}`,
    description: contactDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact ${siteConfig.name}`,
    description: contactDescription,
  },
}

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Get in touch
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Have a project in mind, a role to discuss, or just want to say hello? Send a message and I&apos;ll reply soon.
        </p>
      </section>
      <section className="mx-auto w-full max-w-2xl">
        <ContactForm />
      </section>
    </div>
  )
}
