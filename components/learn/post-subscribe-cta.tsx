import Link from "next/link"
import { SubscribeForm } from "@/components/subscribe-form"
import type { SubscribeSource } from "@/lib/subscribe-schema"

interface PostSubscribeCtaProps {
  source: Extract<SubscribeSource, "post-cta" | "snippet-cta">
}

export function PostSubscribeCta({ source }: PostSubscribeCtaProps) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 md:p-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Liked this? Get the next one in your inbox.
          </h2>
          <p className="text-base text-muted-foreground">
            One email every other Tuesday. Engineering, product, and what
            I&apos;m shipping. Unsubscribe anytime.
          </p>
        </div>
        <SubscribeForm
          source={source}
          variant="full"
          fineprint={
            <>
              No spam. See the{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-foreground"
              >
                privacy policy
              </Link>
              .
            </>
          }
        />
      </div>
    </section>
  )
}
