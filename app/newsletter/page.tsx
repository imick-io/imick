import { SubscribeForm } from "@/components/subscribe-form"

export default function NewsletterPage() {
  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-24">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Newsletter
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Subscribe to get updates in your inbox.
        </p>
      </section>
      <section className="mx-auto w-full max-w-2xl">
        <SubscribeForm source="newsletter-page" variant="full" />
      </section>
    </div>
  )
}
