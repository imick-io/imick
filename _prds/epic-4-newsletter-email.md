# PRD: EPIC 4 — Newsletter

**Status:** Draft
**Date:** 2026-05-04
**Brief:** `_briefs/imick-io-brief.md`

---

## Problem Statement

The brief commits to reaching 1,000 Beehiiv newsletter subscribers within 6 months and frames the newsletter as the primary mechanism for converting one-time readers into a recurring, owned audience. Today there is no way to subscribe from imick.io — readers who finish a blog post, browse a snippet, or land on the homepage have nowhere to "save" the relationship. Every visitor who doesn't bookmark the site is lost on exit. Without a native subscribe surface that feels as polished as the rest of the site, the brand momentum from EPICs 1-3 (portfolio, Learn, Bookmarks) leaks out instead of compounding into a list.

(Note: the contact form + Resend integration listed under EPIC 4 in the brief was already shipped as part of EPIC 1 and is therefore out of scope here.)

---

## Solution

Add a Beehiiv newsletter subscription system across the site, integrated via Beehiiv's REST API through a Next.js server action. The form appears in three locations — a dedicated `/newsletter` pitch page, a site-wide footer slot, and an inline CTA at the bottom of every blog post and snippet — each tagged with a UTM source so signup origin is queryable in Beehiiv's dashboard. Subscribers go through Beehiiv's double opt-in confirmation flow (handled by Beehiiv) and then receive a welcome email driven by a Beehiiv automation (configured manually, no code). The form is email-only to maximize conversion, uses a honeypot field for spam protection, and shows differentiated success/error states inline. A new `/privacy` page documents what data is collected and how it's processed, satisfying GDPR transparency requirements without a consent checkbox.

---

## User Stories

### Visitor / Prospective Subscriber

1. As a visitor, I want to find a newsletter signup option in the site footer on every page, so that I can subscribe without hunting for it once I'm ready.
2. As a visitor, I want a dedicated `/newsletter` page I can be linked to from X or LinkedIn, so that I can read the full pitch before subscribing.
3. As a visitor on the `/newsletter` page, I want to see a clear value proposition (what I'll get, how often, what topics), so that I can decide whether the newsletter is worth my inbox space.
4. As a visitor on the `/newsletter` page, I want to see a list of recent issues (linked to Beehiiv's hosted archive), so that I can sample the content before committing.
5. As a reader of a blog post, I want a relevant subscribe CTA at the bottom of the article, so that I can sign up while I'm still in a moment of value-received.
6. As a reader of a code snippet, I want a subscribe CTA at the bottom of the snippet, so that the same conversion opportunity exists across all Learn content.
7. As a subscriber, I want to provide only my email address (no name, no other fields), so that signup takes 5 seconds.
8. As a subscriber, I want to receive a confirmation email after submitting the form, so that I know my subscription was received and can confirm intent.
9. As a subscriber who clicks the confirmation link, I want to receive a welcome email shortly after, so that I get oriented to what's coming and feel the publication is alive.
10. As a returning visitor who is already subscribed, I want a friendly "you're already on the list" message rather than an error, so that I don't think the site is broken.
11. As a visitor with a typo in my email, I want immediate inline validation, so that I can fix it before submitting.
12. As a visitor experiencing an API outage, I want a clear "try again later" message rather than a hung form, so that I know to come back.
13. As a privacy-conscious visitor, I want a link to a privacy policy near the form, so that I can understand what happens to my email before subscribing.
14. As a privacy-conscious visitor, I want the privacy policy to clearly state which third parties process my data (Beehiiv, Resend), so that I can evaluate the trust chain.
15. As a visitor on mobile, I want the footer form to stack cleanly and remain usable, so that I can subscribe from my phone.
16. As a visitor reading a long blog post on mobile, I want the post-article CTA to feel native to the content, so that it doesn't disrupt the reading experience.

### Subscriber Post-Confirmation

17. As a confirmed subscriber, I want the welcome email to set expectations (cadence, topics, what I'll get next), so that I'm not surprised when the next issue arrives.
18. As a subscriber, I want every newsletter email to include an unsubscribe link, so that I can opt out at any time (handled natively by Beehiiv).

### Site Owner (Michael)

19. As the site owner, I want subscribers tagged with their signup source (`newsletter-page`, `footer`, `post-cta`, `snippet-cta`), so that I can see in Beehiiv which surfaces convert best and double down on what works.
20. As the site owner, I want all signups routed through Beehiiv's double opt-in flow, so that my list stays clean and my deliverability stays high.
21. As the site owner, I want the welcome email configured as a Beehiiv automation (not in code), so that I can edit copy without a deploy.
22. As the site owner, I want a honeypot field on the form to block dumb bots, so that my list isn't polluted with garbage signups.
23. As the site owner, I want the form to handle Beehiiv's "already subscribed" response gracefully, so that returning visitors aren't shown an error.
24. As the site owner, I want errors logged to the server (Vercel logs) but not exposed to the user, so that I can debug without leaking implementation details.
25. As the site owner, I want the social-proof slot on `/newsletter` (e.g., "Join 500+ developers") to be a manually maintained constant that I bump at round-number milestones, so that I don't display embarrassing low counts early on or build live API plumbing I don't need.
26. As the site owner, I want the `/newsletter` page metadata, OG image, and sitemap entry wired up like every other public page, so that the page is shareable and discoverable.
27. As the site owner, I want a `/privacy` page that covers all data collection on the site (newsletter, contact form, resume gate), so that I'm transparent and GDPR-defensible.
28. As the site owner, I want the privacy page linked from the site footer and from the fine-print under every form (newsletter, contact, resume gate), so that visitors can find it from any data-collection surface.
29. As the site owner, I want the newsletter subscribe component reused across all three locations (pitch page, footer, post-CTA), so that I can change the UX in one place and have it propagate everywhere.

---

## Implementation Decisions

### Integration Mechanism

- Subscriptions are submitted via a Next.js Server Action that calls Beehiiv's REST API V2: `POST /publications/{publication_id}/subscriptions`.
- API key (`BEEHIIV_API_KEY`) and publication ID (`BEEHIIV_PUBLICATION_ID`) are stored in environment variables and never exposed to the client.
- The API request body includes the email and a `utm_source` value identifying the signup location.

### Form Fields

- **Email only.** No name, role, or additional fields.
- Validation uses Zod on the client (immediate feedback) and re-validates server-side in the action.
- A hidden honeypot field is included; non-empty submissions are silently dropped server-side.

### Subscription Form Component

- A single shared component is used in all three locations (pitch page, footer, post-CTA).
- The component accepts a `source` prop (one of `newsletter-page`, `footer`, `post-cta`, `snippet-cta`) which is forwarded to the server action and then to Beehiiv as `utm_source`.
- The component accepts a `variant` prop to control visual treatment (full pitch card vs compact footer row).

### Surfaces

1. **`/newsletter` page** — full pitch page. Content blocks in order:
   - H1 + tagline
   - 3-4 bullets describing what subscribers get (cadence, content mix)
   - Subscribe form (full variant)
   - Social-proof line (rendered conditionally — see "Social Proof" below)
   - Recent issues section: link out to Beehiiv's hosted archive (no embedded preview in v1)
2. **Site footer** — compact form, present on every page. Single-row layout on desktop (label + email input + button inline), stacked on mobile. Fine-print line below: "No spam. Unsubscribe anytime. [Privacy](/privacy)."
3. **End of every blog post and snippet** — full-bleed card variant, identical visual + copy across both content types. Heading: "Liked this? Get the next one in your inbox." Followed by a short value line + form. Inserted after the article body, before any related-content section.

### Opt-in Flow

- **Double opt-in** is enforced via Beehiiv publication settings (manual config).
- After form submit, the success state replaces the form inline with: "Almost done! Check your inbox to confirm your subscription."
- Beehiiv sends the confirmation email; clicking the link in that email completes the subscription.
- A welcome email is sent post-confirmation via a Beehiiv automation (configured in Beehiiv's dashboard, not in our codebase).

### Success / Error States

All states render inline (form is replaced or shown with message). No redirects, no toasts, no modals. Mirrors the existing contact form pattern.

- **Success (new subscriber)** → "Almost done! Check your inbox to confirm your subscription."
- **Already subscribed (Beehiiv returns existing-subscriber response)** → "You're already on the list! Check your inbox for past issues." Treated as success, not error.
- **Invalid email (caught by Zod)** → inline field-level error: "Please enter a valid email address."
- **Beehiiv API error / 5xx / network failure** → "Subscription temporarily unavailable. Please try again in a moment." Server-side `console.error` logs the underlying error for Vercel log capture.
- **Honeypot tripped** → silent server-side success response (return ok without calling Beehiiv). No user feedback.

### Source Tracking

- Each form instance passes a `source` value to the server action.
- The server action forwards this as `utm_source` in the Beehiiv API call.
- Beehiiv stores and surfaces this on each subscription, queryable in their dashboard. No additional code or storage on our side.

### Social Proof on `/newsletter`

- A single subscriber-count constant lives in `siteConfig` (e.g., `newsletterSubscriberMilestone: 0`).
- The social-proof slot renders only when the constant is ≥ a threshold (e.g., 100).
- Below the threshold, the slot does not render at all.
- Bumping the number is a manual one-line code change, performed at round-number milestones (100, 250, 500, 1000).

### `/privacy` Page

- A new route added to `app/privacy/page.tsx`, content authored as plain JSX or pulled from a single MDX file (matching whichever pattern the existing `/about` content uses).
- Plain-English coverage of: what data is collected (newsletter email, contact form fields, resume gate fields), why, who processes it (Beehiiv, Resend — linked to their privacy policies), how to unsubscribe / request deletion, and the contact email for data requests.
- Linked from: site footer, fine-print under the newsletter form, fine-print under the contact form, fine-print under the resume gate form.
- Standard Next.js metadata (title, description, canonical, OG image via the existing `opengraph-image.tsx` convention).
- Added to `sitemap.ts`.

### SEO & Discoverability

- `/newsletter` and `/privacy` both get standard per-page `metadata` exports (title, description, canonical, OG).
- Both pages are added to `app/sitemap.ts`.
- An `opengraph-image.tsx` is added under `/newsletter` matching the patterns used for other top-level pages.

### Navigation

- A "Newsletter" link is added to the primary nav once the `/newsletter` page ships.
- A "Privacy" link is added to the footer nav.

### Manual Setup (Prerequisites)

These are configured outside the codebase and must be done before the integration can be tested end-to-end:

1. Beehiiv account + publication created.
2. Publication basics set (name, sender name, sender email).
3. Double opt-in toggled ON in publication settings.
4. Welcome email automation configured (trigger: subscriber confirmed).
5. API key generated and stored as `BEEHIIV_API_KEY` in `.env.local` + Vercel env (Production + Preview).
6. Publication ID stored as `BEEHIIV_PUBLICATION_ID` in `.env.local` + Vercel env.

---

## Out of Scope

- **Contact form + Resend** — already shipped in EPIC 1.
- **Resume gate flow + Resend** — already shipped in EPIC 1.
- **Live subscriber count fetched from Beehiiv API** — manual milestone constant only in this EPIC.
- **Embedded recent-issue previews on `/newsletter`** — link out to Beehiiv's hosted archive only.
- **Custom welcome email sent via Resend** — Beehiiv automation handles this; no app-level email.
- **Explicit consent checkbox on the form** — privacy policy link + double opt-in is sufficient.
- **CAPTCHA (hCaptcha, Turnstile, reCAPTCHA)** — honeypot only.
- **Per-IP rate limiting** — defer until abuse is observed.
- **Personalized welcome flow based on signup source** — all subscribers receive the same welcome email regardless of source. UTM is for analytics only.
- **Subscriber preferences page (interests, frequency)** — Beehiiv's hosted preference page is sufficient if needed; no custom UI.
- **Newsletter archive page rendered in our app** — Beehiiv's hosted archive is the canonical destination.
- **Analytics event tracking on form interactions** — defer to a future analytics-focused EPIC.
- **A/B testing of CTA copy or placement** — out of scope.
- **Newsletter referral program UI** — Beehiiv has built-in referral tooling; will be enabled once subscriber count justifies it (per the brief, at 250).
- **Multi-language privacy policy** — English only.

---

## Further Notes

- The Beehiiv API uses Bearer-token authentication. The server action should construct requests with `Authorization: Bearer ${BEEHIIV_API_KEY}` and `Content-Type: application/json`.
- The Beehiiv subscription endpoint accepts (at minimum) `email`, and optionally `utm_source`, `utm_medium`, `utm_campaign`, `referring_site`, and custom field values. We use `email` + `utm_source` only.
- Beehiiv's "already subscribed" response is currently returned as a `200` with a `status` field on the subscription object indicating existing/active status — the server action must inspect the response body, not just the HTTP status, to differentiate new from existing subscribers and surface the appropriate message.
- The footer and post-article CTAs ship together with the `/newsletter` page — no partial rollout. All three surfaces should appear in a single deploy so the experience is coherent.
- The `/privacy` page is a hard prerequisite for shipping the newsletter form — the form fine-print links to it. Do not deploy the form without the privacy page live.
- The welcome email automation in Beehiiv is a manual setup step but should be treated as launch-blocking — without it, confirmed subscribers receive nothing until the next issue, which damages first-impression trust.
- Subscriber-count milestone bumps are deliberately manual; a brief launch checklist should remind the owner to update `siteConfig` when crossing 100/250/500/1000.
