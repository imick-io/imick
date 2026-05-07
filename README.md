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
