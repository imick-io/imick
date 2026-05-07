---
name: to-article
description: Turn rough notes, bullet points, or brainstorming from the conversation into an article draft for content/posts, after grilling the user to sharpen thesis, audience, and the non-obvious takeaway. Matches the voice and tone of existing posts and links to them when relevant. Use when user has unstructured notes or ideas in the chat and wants them shaped into an article.
---

# To articles

## Workflow

### 1. Confirm inputs

Ask the user, in one round:
- **Target length**: short essay (~400 words), blog (~800-1200), long-form (~1500+), or a custom number.
- **Audience and tone**: who is reading, how technical, formal or conversational. Default to matching existing posts (see step 2).
- **Output filename**: slug only (e.g. `why-i-stopped-using-zod`). The skill writes to `content/posts/<slug>.mdx`.

Treat the rough notes already in the conversation as the source material. Do not ask the user to re-paste them.

### 2. Read the existing voice

Before grilling, read 2-3 existing posts in `content/posts/` to internalise voice, paragraph length, and recurring themes. Note:
- Recurring topics the user has already written about (so you can link to them later).
- Sentence rhythm: short paragraphs, direct "you" address, concrete-before-abstract.
- Vocabulary the user actually uses; do not introduce new jargon.

### 3. Grill before drafting

Run an inline grilling pass tailored to articles. Ask one question at a time, wait for an answer, then move on. Goal: pull out the thesis, the surprising bit, and the weak spots before any prose is written.

Cover, in order:
1. **Thesis** — what is the single sentence the reader should walk away with? If it takes more than one sentence, the article is two articles.
2. **Audience** — who specifically is the reader, and what do they already believe or know about this topic?
3. **Why now / why you** — what makes this worth writing today, and what makes the user the right person to write it? Often a recent experience or contrarian take.
4. **The surprising part** — what would make a reader who already knows the topic pause? If nothing, it is a summary, not an article. Push for the non-obvious claim.
5. **Concrete grounding** — what specific example, story, code snippet, or number anchors the abstract claims? Keep asking until at least one is named.
6. **Weakest claim** — where would a sharp reader push back? Surface the strongest objection so the draft can address it rather than ignore it.
7. **Prior art in this blog** — does any existing post in `content/posts/` cover related ground? If yes, plan to link to it rather than re-explain.
8. **Call to action** — what should the reader do, think, or feel differently after reading?

If an answer is vague, push once more for specificity. Stop when each question has a usable answer; do not over-grill.

### 4. Propose an outline

Based on grill answers, draft an outline as a list:
- Working title (one option, not three).
- Thesis sentence.
- Suggested frontmatter values: `excerpt` (1-2 sentences), `category`, `tags`, `publishedAt` (today's date).
- Section list with one-line beats each, ordered so no section's claims depend on later sections.
- Where the surprising bit lands.
- Where the objection is addressed.
- Which existing posts to link to and where.

Show the outline to the user. Wait for confirmation or revisions before drafting.

### 5. Write the draft

Write the full `.mdx` to `content/posts/<slug>.mdx` with frontmatter matching existing posts (`title`, `excerpt`, `publishedAt`, `category`, `tags`, `coverImage`). Leave `coverImage` blank for the user to fill.

Style, matched to existing posts:
- Short paragraphs, max ~240 characters each.
- No em-dashes. Use commas, periods, or parentheses instead.
- Direct second-person ("you") where existing posts use it.
- Plain prose, no throat-clearing openings like "In this article we will explore...".
- Concrete before abstract: lead a section with the example, then the lesson.
- Keep the user's voice from the original notes; do not flatten phrases that sound like them, and do not import vocabulary the user does not use.
- When linking to other posts in `content/posts/`, only link when it spares you re-explaining a concept; use the slug-based path the site expects.

### 6. Hand off

Tell the user the draft is at `content/posts/<slug>.mdx` and suggest `/edit-article` for a structural revision pass once they have read through it.

## Notes

- This skill drafts; it does not polish. Heavy line-editing is `/edit-article`'s job.
- If the user's notes are already structured (numbered outline, full sentences), shorten the grill — only ask the questions whose answers are not already in the notes.
- If the notes are very thin (a sentence or two), grill harder before drafting; do not invent material to fill length.
- Voice match is more important than feature-completeness of the outline. A draft that sounds like the user beats a draft that hits every grill answer.
