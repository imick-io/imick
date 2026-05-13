# imick.io

Personal site of [Michael Boutin](https://imick.io). The platform is open source as a credibility signal; the long-form content lives in a separate private repo.

## Repo layout

This repo (`imick-io/imick`) contains the **platform**: app code, components, schemas, infrastructure. It does *not* contain articles or snippets.

The **content** (Articles, Snippets, and future Classes) lives in a private repo: `imick-io/imick-io-content`. It is cloned into `content/` at install time.

This split exists so future paid Classes can live behind a real paywall without rearchitecting. See `docs/adr/0001-content-storage-and-open-source-boundary.md`.

## Getting started

You need read access to `imick-io/imick-io-content` to develop locally. Without it, the build fails because `content/posts/` and `content/snippets/` will be empty.

### 1. Create a fine-grained PAT

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.
2. Resource owner: your GitHub user (or the org that owns `imick-io-content`).
3. Repository access: *Only select repositories* → `imick-io-content`.
4. Permissions: **Contents: read-only**.
5. Copy the token.

### 2. Configure `.env.local`

```bash
cp .env.example .env.local  # if .env.example exists; otherwise create the file
```

Add:

```
CONTENT_REPO_TOKEN=github_pat_...
```

### 3. Install and run

```bash
pnpm install   # postinstall fetches content/ from the private repo
pnpm dev
```

`pnpm install` runs `scripts/fetch-content.mts`, which clones the content repo and mirrors `posts/` and `snippets/` into `content/`. Re-run it any time with `pnpm fetch-content`.

If you have already cloned `imick-io-content` manually and populated `content/`, the script skips the fetch when `CONTENT_REPO_TOKEN` is unset.

## Vercel deployment

Set `CONTENT_REPO_TOKEN` as a project environment variable in Vercel (Production, Preview, and Development scopes). The `postinstall` hook runs the same fetch script during the Vercel build.

## Scripts

- `pnpm dev` — Next.js dev server
- `pnpm build` — production build
- `pnpm fetch-content` — re-pull content from the private repo
- `pnpm typecheck` — TypeScript check
- `pnpm test` — vitest
- `pnpm db:migrate` — apply Drizzle migrations

## Issue workflow

Five Claude Code skills drive an issue from planning to refactor. They are user-invokable only, run in the same session, and gate every transition on human review. You create the branch and close the issue yourself.

| Step | Skill | What it does |
| --- | --- | --- |
| 0 | `/parallel-plan [label]` | (Optional) Reads open `ready-for-agent` issues (or the passed label), builds a dependency graph, and emits a `<plan>` JSON block of unblocked candidates. Use to pick the next issue when several are ready. Read-only. |
| 1 | `/plan-work <issue>` | Reads the issue + linked PRD, explores the code, enters Plan Mode with a structured plan that declares `Approach: RGR` or `Approach: direct (rationale)`. Read-only. |
| 2 | `/do-work` | Implements per the approved plan in the same session. Runs `pnpm typecheck` and `pnpm test` with a self-fix cap of 5. Never commits. |
| 3 | `/commit-work` | Drafts a `feat:`/`fix:`/`chore:` commit with `Refs #N` footer (no auto-close). Final typecheck + test gate. Waits for approval before committing. |
| 4 | `/review-work [<hash>]` | Refactors the last commit (or `<hash>...HEAD`) in place using generic heuristics + `docs/coding-standards.md`. Preserves behaviour. Never commits. |
| 5 | `/commit-review` | Drafts a `refactor:` commit with `Refs #N` footer. Final gate. Waits for approval. |

Typical flow:

```bash
# optional: pick the next unblocked issue
/parallel-plan    # review the <plan> JSON, pick an id

git checkout -b sandcastle/issue-23-fix-foo
# in Claude Code:
/plan-work 23     # review plan in Plan Mode, approve
/do-work          # review modified files
/commit-work      # review draft message, approve
/review-work      # review refactored files
/commit-review    # review draft message, approve
# when you're satisfied:
gh issue close 23
```

Skip `/review-work` and `/commit-review` for trivial changes. Skip `/plan-work` only when the work is genuinely too small to plan. Skip `/parallel-plan` when you already know which issue you are picking up.

The legacy `.sandcastle/` orchestrator (`pnpm sandcastle`) is retained for autonomous batched runs; the skills above are the manual path.
