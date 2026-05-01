---
name: to-brief
description: Turn a raw business or product idea into a structured high-level product brief saved to `_briefs/`, organized into EPICs. Each EPIC is sized for individual `to-prd-file` spec work. Use when user wants to turn an idea into a product brief, decompose a product concept into EPICs, or kick off structured product planning before detailed spec work.
---

# to-brief

## Inputs

If ARGUMENTS are provided, use them as the initial idea. Otherwise, ask: "What's the product or feature idea you want to plan?"

## Phase 1 — Interview (do not skip)

Interview the user relentlessly until you have enough signal to fill every section in Phase 2 with confidence. Use the `grill-me` style: one question at a time, walk each branch of the decision tree, provide your recommended answer when options exist.

Cover these areas in order — but follow the thread wherever answers lead:

1. **Core problem** — What's broken or missing today? Who feels this pain and how often?
2. **Target users** — Who are the primary users? What do they care about most?
3. **Goals and success** — What does "this worked" look like in 6 months? Any hard metrics?
4. **Non-goals** — What are we explicitly not doing? What would distract or bloat scope?
5. **Constraints** — Tech stack, timeline, budget, compliance, team size?
6. **Open questions** — What decisions can't be made yet? What must be resolved before building?

Do not draft the brief until all six areas have clear answers.

## Phase 2 — Draft brief

Write the brief with these sections in this order:

- **Overview** — one paragraph product/project summary (self-contained; no prior context assumed)
- **Problem** — what's broken or missing today, and the cost of inaction
- **Goals** — 3–5 specific, measurable outcomes
- **Non-Goals** — what this explicitly will not do
- **Target Users** — who uses this and what they care about
- **Success Metrics** — how we know it worked (quantified where possible)
- **EPICs** — 3–7 coarse-grained feature groupings. For each: `name`, one-line description, and a sentence on why it's a coherent unit of work. Order by dependency or delivery priority.
- **Open Questions** — unresolved decisions that must be answered before or during build

No individual user stories or tasks inside EPICs — those belong in the per-EPIC `to-prd-file` runs.

## Phase 3 — Save and hand off

1. Save the brief to `_briefs/<kebab-case-product-name>-brief.md`.
2. After saving, print a ready-to-run invocation for each EPIC:

```
/to-prd-file EPIC: <epic-name> — <one-line description>. Context: see _briefs/<file>.md
```

One line per EPIC, in delivery order.
