---
name: challenge-article
description: Red-team an existing article draft. Extract every claim, fact-check the verifiable ones with web search, stress-test framing and logic, then ask pointed questions on the shaky parts. Outputs a numbered issues list, does not edit the file. Use when user wants to challenge, fact-check, stress-test, or red-team an article draft, or asks "is this accurate".
---

# Challenge article

## Workflow

### 1. Identify the draft

Take a path arg if given. Otherwise list the most recent files in `content/posts/` and ask which one. Read the full mdx before doing anything else.

### 2. Extract claims into three buckets

Read the article and list every claim. Split into:

- **Web-checkable**: specific facts, statistics, dates, names, version numbers, library or API behaviour, historical events, quotes attributed to someone.
- **Framing or logic**: assertions about cause and effect, generalisations ("most teams", "always", "never"), comparisons, predictions, claims about what readers think or do.
- **Personal or anecdotal**: the user's own experience, opinions, taste calls. Leave these alone unless they contradict each other inside the article.

Show the buckets to the user as a numbered list before doing any verification. Lets them flag anything you miscategorised.

### 3. Verify the web-checkable bucket

For each item, run a web search. Compare the article's claim to what authoritative sources say. Record:
- Confirmed (source agrees).
- Wrong (source contradicts) — note the correct value and the source.
- Unverifiable (no clear source either way) — flag for the user to confirm.

Cite sources by URL so the user can check your work. Do not trust a single low-quality source for a "wrong" verdict; cross-check with a second.

### 4. Hostile read on framing and logic

For the second bucket, attack the article as a sharp reader would. Look for:
- Generalisations the article does not earn ("most developers" with no data behind it).
- Logical gaps where step B does not follow from step A.
- Motivated reasoning, where the conclusion was decided before the evidence.
- Missing counterarguments the strongest critic would raise.
- Claims that contradict the user's prior posts in `content/posts/`. Skim a few to check.
- Claims that contradict each other inside the same article.

### 5. Ask pointed questions

For the shakiest items from steps 3 and 4, ask the user one question at a time. Same cadence as `/to-article`'s grill: wait for an answer, then move on. Goal is to either get a defensible answer or surface that the claim should be softened or dropped.

Stop once each shaky item has a usable answer. Do not over-grill items the user has already defended.

### 6. Output the issues list

Write a numbered list to the chat (do not edit the mdx). Each item:
- **Severity**: `factual error`, `weak claim`, `framing nit`, or `unverifiable`.
- **Quote**: the exact line from the article.
- **Issue**: one sentence on what is wrong.
- **Suggested fix**: rewrite, soften, cut, or "needs source".
- **Source** (for factual errors): URL.

Group by severity, factual errors first.

### 7. Hand off

Tell the user the issues list is above and suggest `/edit-article` to apply fixes once they have decided which to act on. Do not edit the article yourself; the user picks what to change.

## Notes

- This skill challenges; it does not rewrite. Fixes are `/edit-article`'s job.
- No em-dashes in any output. Use commas, periods, or parentheses.
- If the article has fewer than five claims total, skip the bucket display and just go through them inline.
- Personal anecdotes are off-limits for challenge unless they contradict each other or the user's prior posts.
- Be specific in citations. "Some source says otherwise" is not a finding; a URL with a quoted line is.
