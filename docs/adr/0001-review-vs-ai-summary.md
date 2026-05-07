---
status: accepted
---

# Review vs. AI Summary on Bookmarks

A **Bookmark** has two prose fields that look superficially similar: `reviewText` (the **Review**) and a new `aiSummary` (the **AI Summary**). They are deliberately separate, never merged, and rendered with distinct labels.

- `reviewText` carries the site owner's personal opinion, in his own voice, based on actual use of the tool. Always human-authored. Rendered under the heading "Review", alongside the human-set 1–5 `rating`.
- `aiSummary` carries a neutral, model-generated description of what the tool *is* and *does*, sourced from the tool's own page. Rendered under the heading "About this tool" with a visible "AI-generated" pill so readers can tell the difference at a glance.

## Considered options

1. **Single field**, AI fills it when empty, human edits later. *Rejected* — once the AI's neutral prose lives in the same field as the human's opinion, the boundary erodes. Readers can no longer tell whether the prose reflects the site owner's actual experience or a model's summary of marketing copy. The whole point of a personal bookmark stack is that the opinions are personal; conflating the two destroys that signal.
2. **AI fills `reviewText` directly.** *Rejected* for the same reason in stronger form — generating prose in the first person about a tool the model has never used would publish fabricated personal experience under the site owner's name.
3. **Two distinct fields, distinct labels.** *Accepted* — preserves the human/machine boundary in the schema, in the rendering, and in the domain language (see CONTEXT.md "Review" and "AI Summary" entries).

## Consequences

- The bookmark detail page renders the two fields in separate blocks with different headings. Future UI work must keep the labels distinct.
- The "Generate with AI" admin button never writes to `reviewText` or `rating`, only to `tags`, `category`, `pros`, `cons`, and `aiSummary`. This invariant is part of the contract — if a future change makes AI write to `reviewText`, this ADR has been violated and should be revisited.
- A bookmark may have an `aiSummary` without ever being "Reviewed" (no `rating`, no `reviewText`). The "Reviewed" badge therefore continues to mean *human verdict present*, not *content present*.
