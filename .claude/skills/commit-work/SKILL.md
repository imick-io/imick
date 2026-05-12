---
name: commit-work
description: "Creates an implementation commit with a conventional commit message (feat:/fix:/chore:) chosen from the diff and the issue title. Footer references the issue with `Refs #N` (never `Closes`, so the issue does not auto-close). Runs pnpm typecheck and pnpm test as a final gate. Use when user types /commit-work after reviewing /do-work output."
---

# Commit the implementation

## Workflow

1. **Final gate** — hard precondition. If either fails, stop and report; do not commit.
   - `pnpm typecheck`
   - `pnpm test`
2. **Inspect what's pending**:
   - `git status`
   - `git diff --staged`
   - `git diff`
3. **Determine the prefix** from the issue title (in conversation context from `/plan-work`) plus the diff:
   - `feat:` — adds a new user-facing capability
   - `fix:` — corrects a bug or incorrect behaviour
   - `chore:` — config, dependency, or tooling change
4. **Draft the commit message** in this shape:

   ```
   <prefix>: <concise subject lifted from the issue title> (#<issue>)

   <one or two short bullet points on what changed and why, if non-obvious>

   Refs #<issue>
   ```

   Use `Refs #N`. Never `Closes #N` or `Fixes #N` — the user closes issues manually.

5. **Show the user**:
   - The draft message
   - The list of files to be staged
6. **Wait for approval**, then:
   - `git add <files>` (specific paths, never `git add -A` or `git add .`)
   - `git commit -m "<message>"`

## Invariants

- Never commit without typecheck + test passing.
- Never use `Closes`/`Fixes`/`Resolves` — only `Refs`.
- Never `git add -A` or `git add .` — stage specific files only.
- Never push.
- Do not switch branches.
