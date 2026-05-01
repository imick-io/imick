---
name: test-brief
description: Stress-test and sharpen a raw product or business idea through structured adversarial dialogue, then produce a refined product brief via the `to-brief` skill. Use when user wants to validate or improve a business idea, challenge assumptions before planning, or says "refine my brief", "refine my idea", "is this a good idea", or "help me think through this idea".
---

# refine-brief

## Inputs

If ARGUMENTS are provided, treat them as the raw idea. Otherwise ask: "What's the business or product idea you want to refine?"

## Phase 1 — Understand (2–4 questions)

Before challenging, make sure you understand the idea. Ask only what you need to run Phase 2 effectively:

1. What problem does this solve, and for whom?
2. What's the proposed solution or mechanism?
3. Why now — what's changed that makes this possible or necessary?

One question at a time. Don't move to Phase 2 until you have answers to all three.

## Phase 2 — Challenge (do not skip)

Act as a skeptical but fair investor/advisor. Stress-test the idea across all five axes. One question or challenge at a time — follow threads, don't rush to the next axis until the current one is resolved.

**Axes to cover:**

1. **Problem validity** — Is this a real, frequent, painful problem — or a nice-to-have? Who has this problem today and what do they do instead?
2. **Market** — Who exactly is the primary customer? Is the addressable market large enough to build a business? Is it growing or shrinking?
3. **Differentiation** — Why can't an existing player (Google, an incumbent, a freelancer) solve this in 6 months? What's the defensible moat?
4. **Monetization** — Who pays, how much, and why would they? Is there a clear path from value delivered to revenue captured?
5. **Founder/team fit** — Why is this the right person or team for this specific idea? What unfair advantage do they have?

When you find a weak answer: push back, propose a pivot or reframe, and ask the user to respond to it. Don't accept hand-waves — if an axis can't be defended, surface it explicitly.

## Phase 3 — Refine

After working through all five axes, synthesize what you've learned:

1. Write a **Refined Idea Statement** (2–3 sentences): the sharpened version of the original idea, incorporating any pivots or clarifications from the dialogue.
2. List **Surviving Strengths** (2–4 bullets): what held up under challenge.
3. List **Known Risks** (2–4 bullets): unresolved weaknesses the user must watch.
4. Ask: "Does this refined idea match your intent, or do you want to adjust before I write the brief?"

Do not proceed to Phase 4 until the user confirms the refined idea.

## Phase 4 — Brief

Invoke the `to-brief` skill, passing the Refined Idea Statement as the input idea.

Tell the user: "Handing off to `to-brief` to build the structured product brief."
