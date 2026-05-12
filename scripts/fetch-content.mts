// Hydrates `content/{posts,snippets,folios,classes}` and `public/assets/content/`
// from the private `imick-io/imick-io-content` repo. Runs on `pnpm install`
// (postinstall) and before any production build.
//
// Auth: reads `CONTENT_REPO_TOKEN` (fine-grained PAT, Contents:read on the
// content repo) from the environment. On Vercel, set it as a project env var.
// Locally, put it in `.env.local`.
//
// Behaviour:
//   - Token + reachable network: shallow-clones the repo, mirrors the MDX
//     subdirs into `content/`, and mirrors `assets/` into
//     `public/assets/content/`.
//   - No token but `content/` already populated: skips with a notice.
//     Lets contributors run `pnpm install` after a manual clone without
//     needing a PAT.
//   - No token and content missing: fails loudly.

import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readdirSync, rmSync, cpSync } from "node:fs"
import { join } from "node:path"
import nextEnv from "@next/env"

const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

const ROOT = process.cwd()
const CONTENT_DIR = join(ROOT, "content")
const PUBLIC_ASSETS_DIR = join(ROOT, "public", "assets", "content")
const CACHE_DIR = join(ROOT, ".content-cache")
const REPO = "imick-io/imick-io-content"
const BRANCH = "main"
const SUBDIRS = ["posts", "snippets", "folios", "classes"] as const

function hasMdx(dir: string): boolean {
  if (!existsSync(dir)) return false
  return readdirSync(dir).some((f) => f.endsWith(".mdx"))
}

function contentAlreadyPopulated(): boolean {
  return SUBDIRS.every((sub) => hasMdx(join(CONTENT_DIR, sub)))
}

function shallowClone(token: string) {
  const remote = `https://x-access-token:${token}@github.com/${REPO}.git`
  rmSync(CACHE_DIR, { recursive: true, force: true })
  execSync(`git clone --depth 1 --branch ${BRANCH} ${remote} ${CACHE_DIR}`, {
    stdio: ["ignore", "inherit", "inherit"],
  })
  // Strip the token out of the stored remote URL so it never lands on disk
  // beyond this process.
  execSync(
    `git -C ${CACHE_DIR} remote set-url origin https://github.com/${REPO}.git`,
  )
}

function mirrorDir(src: string, dest: string, label: string) {
  if (!existsSync(src)) {
    console.warn(
      `fetch-content: '${label}' not present in ${REPO}, skipping (local copy left as-is)`,
    )
    return
  }
  rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true })
  console.log(`fetch-content: mirrored ${label}`)
}

function mirrorIntoContent() {
  for (const sub of SUBDIRS) {
    mirrorDir(join(CACHE_DIR, sub), join(CONTENT_DIR, sub), `${sub}/`)
  }
}

function mirrorAssets() {
  mirrorDir(join(CACHE_DIR, "assets"), PUBLIC_ASSETS_DIR, "assets/ -> public/assets/content/")
}

async function main() {
  mkdirSync(CONTENT_DIR, { recursive: true })

  const token = process.env.CONTENT_REPO_TOKEN

  if (!token) {
    if (contentAlreadyPopulated()) {
      console.log(
        "fetch-content: CONTENT_REPO_TOKEN not set but content/ is already populated. Skipping fetch.",
      )
      return
    }
    throw new Error(
      "fetch-content: CONTENT_REPO_TOKEN is not set and content/ is empty. " +
        "Set the token in .env.local (or your Vercel project env) so the " +
        "private content repo can be cloned. See README.",
    )
  }

  console.log(`fetch-content: cloning ${REPO}#${BRANCH}`)
  shallowClone(token)
  mirrorIntoContent()
  mirrorAssets()
  console.log("fetch-content: done")
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
