# Plan: EPIC 4 — Newsletter

> Source PRD: `_prds/epic-4-newsletter-email.md`

## Architectural decisions

- **Routes (new):** `/newsletter` (pitch page) · `/privacy` (privacy policy)
- **Integration:** Beehiiv REST API V2 — `POST /publications/{publication_id}/subscriptions` via Next.js Server Action. Bearer-token auth.
- **Env vars:** `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID` — server-only, never exposed to client. Stored in `.env.local` + Vercel (Production + Preview).
- **Shared component:** A single `SubscribeForm` component reused across all three surfaces, with `source` (`newsletter-page` | `footer` | `post-cta` | `snippet-cta`) and `variant` (`full` | `compact`) props. Source forwarded to Beehiiv as `utm_source`.
- **Form fields:** Email only. Hidden honeypot field. Zod validation client-side and server-side.
- **Opt-in flow:** Double opt-in enforced via Beehiiv publication settings (manual config). Welcome email sent via Beehiiv automation (manual config). No app-level email plumbing.
- **State pattern:** Inline success/error states replacing or accompanying the form — mirrors existing contact form pattern. No redirects, toasts, or modals.
- **Already-subscribed handling:** Server action inspects Beehiiv response body (not just HTTP status) and treats existing subscribers as a success state with differentiated copy.
- **Honeypot tripped:** Server returns ok without calling Beehiiv; no user feedback.
- **Social proof:** Single manually maintained `newsletterSubscriberMilestone` constant in `siteConfig`. Renders only above a threshold; manual bumps at 100/250/500/1000.
- **SEO:** `/newsletter` and `/privacy` get standard per-page `metadata`, OG images, and `app/sitemap.ts` entries.
- **Privacy page scope:** Plain-English coverage of newsletter, contact form, and resume gate data collection. Linked from site footer and fine-print under every data-collection form.

---

## Phase 1: Tracer bullet — Beehiiv integration + minimal `/newsletter`

**User stories:** 7, 8, 10, 11, 12, 19, 20, 22, 23, 24

### What to build

The thinnest end-to-end slice that proves the integration works. Add the Beehiiv env vars and a Zod email schema. Build the shared `SubscribeForm` component with both `source` and `variant` props from day one (even though only one variant is consumed in this phase) so later phases can reuse it without refactor. Build the server action that calls the Beehiiv subscriptions endpoint with the email and `utm_source`, inspects the response body to differentiate new vs already-subscribed, and surfaces inline success / already-subscribed / error states in the form. Wire up the hidden honeypot — non-empty submissions return ok without calling Beehiiv. Server-side `console.error` logs the underlying error for any 4xx/5xx/network failure but the user only sees a generic "try again" message. Stand up a bare `/newsletter` route hosting the form so the integration is reachable in a browser.

### Acceptance criteria

- [ ] Submitting a valid email at `/newsletter` creates a subscription in Beehiiv with the correct `utm_source` value
- [ ] Success state replaces the form with "Almost done! Check your inbox to confirm your subscription."
- [ ] Submitting an email that is already subscribed shows "You're already on the list! Check your inbox for past issues." (treated as success, not error)
- [ ] Invalid email triggers an inline field-level Zod error before the action is called
- [ ] Beehiiv 4xx/5xx or network failure shows "Subscription temporarily unavailable. Please try again in a moment." and logs the underlying error to the server
- [ ] Filling the honeypot field results in a silent ok response with no Beehiiv API call
- [ ] `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` are read from env and never sent to the client

---

## Phase 2: `/privacy` page

**User stories:** 13, 14, 27

### What to build

Build the standalone `/privacy` route as a hard prerequisite for the form fine-print. Plain-English coverage of every data-collection surface on the site: newsletter email (Beehiiv), contact form fields (Resend), and resume gate fields (Resend). Identify each third-party processor by name with links to their privacy policies. Document how to unsubscribe and how to request data deletion, and include a contact email for data requests. Match the page styling to existing top-level pages (`/about`, `/contact`). Add standard per-page metadata, an OG image following the existing `opengraph-image.tsx` convention, and an entry in `app/sitemap.ts`.

### Acceptance criteria

- [ ] `/privacy` renders with title, description, canonical, and OG metadata exported
- [ ] Page lists newsletter, contact form, and resume gate data collection with the third-party processors named (Beehiiv, Resend) and linked
- [ ] Page documents unsubscribe / data-deletion paths and a contact email for data requests
- [ ] OG image renders for `/privacy` matching the existing pattern
- [ ] `/privacy` appears in `app/sitemap.ts`

---

## Phase 3: `/newsletter` polish + SEO + nav

**User stories:** 3, 4, 25, 26

### What to build

Flesh out the `/newsletter` page from a bare form host into the full pitch page. Content blocks in order: H1 + tagline, 3–4 value-prop bullets (cadence, content mix, what subscribers get), the full-variant subscribe form, a conditional social-proof line driven by `siteConfig.newsletterSubscriberMilestone` (renders only when the constant is at or above a threshold of 100), and a "Recent issues" section that links out to Beehiiv's hosted archive (no embedded preview). Add the form fine-print line linking to `/privacy`. Add full per-page metadata (title, description, canonical, OG), an `opengraph-image.tsx` matching the conventions used for other top-level pages, and a `/newsletter` entry to `app/sitemap.ts`. Add a "Newsletter" link to the primary nav in `app/layout.tsx`.

### Acceptance criteria

- [ ] `/newsletter` shows H1, tagline, value-prop bullets, subscribe form, and recent-issues link in order
- [ ] "Recent issues" link opens the Beehiiv hosted archive in a new tab
- [ ] Social-proof slot renders when `newsletterSubscriberMilestone >= 100` and is absent below the threshold
- [ ] Form fine-print includes a link to `/privacy`
- [ ] `/newsletter` has metadata exported, an OG image rendered, and appears in `app/sitemap.ts`
- [ ] "Newsletter" link is present in the primary nav and active-state styled when on `/newsletter`

---

## Phase 4: Site-wide footer + footer subscribe surface

**User stories:** 1, 15, 28

### What to build

Build the global site footer (does not exist yet) into `app/layout.tsx` so it appears on every page. The footer hosts the compact-variant `SubscribeForm` (label + email input + button inline on desktop, stacked on mobile), with the `source` prop set to `footer`. Below the form a fine-print line: "No spam. Unsubscribe anytime. [Privacy](/privacy)." The footer also includes a "Privacy" navigation link. The shared component built in Phase 1 is reused with no changes.

### Acceptance criteria

- [ ] Footer appears on every route in the app
- [ ] Footer subscribe form submits to Beehiiv with `utm_source=footer`
- [ ] On desktop the form is single-row inline; on mobile it stacks cleanly and remains usable
- [ ] Privacy fine-print and Privacy nav link both link to `/privacy`
- [ ] Footer subscribe form shows the same success / already-subscribed / error states as the `/newsletter` form

---

## Phase 5: Post-article + post-snippet CTAs (final ship)

**User stories:** 5, 6, 16

### What to build

Add the full-bleed CTA card variant of `SubscribeForm` to the bottom of every article detail page and snippet detail page — identical visual treatment and copy across both content types. Heading: "Liked this? Get the next one in your inbox." Followed by a short value line and the form. Inserted after the article body and before any related-content section. The article instance passes `source="post-cta"` and the snippet instance passes `source="snippet-cta"`. After this phase all three surfaces (pitch page, footer, post-CTA) are live and the EPIC ships as a single coherent deploy.

Before merging, walk through the Beehiiv manual setup checklist from the PRD and confirm: publication created, double opt-in toggled ON, welcome email automation configured (launch-blocking — confirmed subscribers must receive something on confirmation), API key + publication ID set in Vercel for Production and Preview.

### Acceptance criteria

- [ ] Every article detail page renders the CTA card after the article body and before related content
- [ ] Every snippet detail page renders the same CTA card in the same position
- [ ] Article CTA submissions reach Beehiiv with `utm_source=post-cta`
- [ ] Snippet CTA submissions reach Beehiiv with `utm_source=snippet-cta`
- [ ] Visual treatment and copy of the CTA card is identical across articles and snippets
- [ ] Beehiiv double opt-in is ON in publication settings
- [ ] Beehiiv welcome email automation is configured and fires on subscriber confirmation
- [ ] `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` are set in Vercel Production and Preview environments
