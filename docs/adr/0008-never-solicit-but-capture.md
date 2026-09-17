# Never solicit, but capture whoever self-identifies

The site retains lead-capture machinery (a gated `/resume` behind a form, an anonymous session, a `form_submissions` table) while refusing to signal availability anywhere, in any mode, including while its owner is between contracts. Read cold, that combination looks like an oversight or a contradiction. It is neither. This ADR records why both halves are deliberate, because the obvious "cleanup" in either direction is wrong.

Decided in [Decide what happens to the portfolio funnel](https://github.com/imick-io/imick/issues/59), with the Reader/Buyer distinction from [Name the reader](https://github.com/imick-io/imick/issues/56).

## Decision

**The content surface never asks the reader for anything. The moment a visitor self-identifies as a buyer, their details are taken.**

1. **No availability signal.** No availability badge, no "open to work", no "hire me", no discovery-call CTA. Not temporarily, not while between contracts. The **Buyer** is never addressed; they are served entirely by overhearing a conversation aimed at the **Reader**.
2. **The `/resume` gate stays.** Name, email, company, LinkedIn, and intention are collected before the resume renders, backed by the anonymous session and `form_submissions`. Opening the resume was proposed and declined, as was the middle option of gating only the PDF.
3. **The newsletter is the primary action.** The home hero leads with subscribe; "Get in touch" is a quiet text link, never a button, anywhere on the content surface.
4. **`/contact` stays in the nav**, unchanged and unemphasised.
5. **The career story is content, not machinery.** Experience, education, and the client history stay and grow on `/about` and `/resume`.
6. **`/resume` carries no framing about gaps.** Engagements start and end; the structure already says so.

## Rationale

**Why the two halves are consistent.** A visitor who navigates to a resume has told you something about themselves by doing it. Taking their details at that point is not a pitch, because nothing asked them to come. Solicitation is the site initiating; capture is the site answering. The gate only ever fires after the visitor moves first.

**Why no availability line, even between contracts.** The failure mode of the previous positioning was addressing the Buyer directly, which the Reader can hear. The moment copy speaks to a buyer, the peer register collapses into a pitch and the audience-building job fails. Taking the discipline seriously in the exact week it is inconvenient is what makes it a rule rather than a preference.

**Why not explain the gaps on `/resume`.** Concreo is the top-level employer entry running 2020-08 to present with engagements nested and dated underneath, so the structure already reads as contract work. An explanation would be the first defensive sentence on the site, and it would be addressed to the Buyer.

**What this costs.** Inbound work depends entirely on the writing being good and on buyers finding the quiet paths. That is slower than asking.

## Consequences

- `siteConfig.featuredPostSlugs`, the hero rail, and the `/about` dark card all point at reading and subscribing, never at hiring. The dark `CardFeature` at the bottom of `/about` carries the newsletter rather than the resume.
- The lead-capture stack (better-auth anonymous plugin, `form_submissions`, the resume preview skeleton) is load-bearing and must not be removed as dead weight.
- `/sponsor` was deleted under this decision. Monetizing the audience is a separate effort and is out of scope until taken up deliberately.
- Any future "are we available?" affordance reopens this ADR rather than being a copy tweak.
