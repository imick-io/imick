---
name: commit-review
description: "Creates a refactor commit with `refactor:` prefix and `Refs #N` footer. Runs pnpm typecheck and pnpm test as a final gate. Use when user types /commit-review after reviewing /review-work output."
---

# Commit the refactor

## Workflow

1. **Final gate** — hard precondition. If either fails, stop and report; do not commit.
   - `pnpm typecheck`
   - `pnpm test`
2. **Inspect what's pending**:
   - `git status`
   - `git diff --staged`
   - `git diff`
3. **Draft the commit message** (prefix is always `refactor:`):

   ```
   refactor: <concise description of the refinements> (#<issue>)

   <one or two short bullet points on what was tightened, simplified, or renamed>

   Refs #<issue>
   ```

4. **Show the user**:
   - The draft message
   - The list of files to be staged
5. **Wait for approval**, then:
   - `git add <files>` (specific paths, never `git add -A`)
   - `git commit -m "<message>"`

## Invariants

- Prefix is always `refactor:`. If the staged diff contains new functionality or a bug fix, `/review-work` was used incorrectly — stop and tell the user instead of committing under the wrong prefix.
- Never commit without typecheck + test passing.
- Never use `Closes`/`Fixes`/`Resolves` — only `Refs`.
- Never `git add -A` or `git add .`.
- Never push.
- Do not switch branches.
