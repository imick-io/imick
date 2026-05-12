---
name: plan-work
description: Read-only planning for a GitHub issue. Pulls the issue and any linked PRD, explores relevant code, then enters Plan Mode with a structured plan that declares an explicit Approach (RGR or direct). Use when user types /plan-work with an issue number, or when planning an issue before implementing it manually.
---

# Plan a GitHub issue

`$ARGUMENTS` is the issue number to plan (e.g. `23`). Required.

## Workflow

1. **Read the issue**: `gh issue view <id> --comments`. If the issue references a parent PRD (look for `PRD #N`, links to `_prds/`, or a "Parent PRD" field), pull that too with `gh issue view` or by reading the file.
2. **Recent context**: `git log -n 10 --oneline` to know what landed recently.
3. **Explore relevant code**: locate the files, tests, and modules the issue touches. Read them to understand current behaviour before planning a change.
4. **Enter Plan Mode** and present a plan with these sections:
   - **Understanding** — one paragraph in your own words: what the issue asks for.
   - **Files to touch** — concrete paths.
   - **Approach** — exactly one of:
     - `**Approach: RGR**` (red-green-refactor; this is the default)
     - `**Approach: direct (<rationale>)**` — only if RGR doesn't fit (config-only change, dependency bump, doc edit, UI tweak with no testable behaviour, etc.). State the rationale.
   - **Test ordering** — if RGR, list the tests to write first, second, third. Each is a tracer bullet for one behaviour. Do not list all tests up front.
   - **Key decisions** — design choices where you went with one option over another, and why.
   - **Risks / edge cases** — what could go wrong; what to watch for during implementation.

## Invariants

- This skill is **read-only**. Plan Mode enforces this — never attempt to edit or write files.
- Do not create the branch. The user creates branches manually before implementing.
- Do not commit, do not push, do not modify git state.

## Handoff

After Plan Mode approval, the user invokes `/do-work` in the same session. The approved plan stays in conversation context for the next skill to read — no file persistence.
