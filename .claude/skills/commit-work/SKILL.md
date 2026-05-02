---
name: commit-work
description: Stage reviewed changes, write a descriptive commit message tied to the current plan phase, commit, and push to the remote. Use when the user wants to commit the code, ship the work, or finish a phase from a plan.
---

# Commit Work

Commit reviewed changes with a descriptive message and push to the remote. One commit per invocation.

## Workflow

### 1. Inspect the changes

Run these in parallel:

```
git status
git diff
git diff --staged
git log -n 5 --oneline
```

Review every modified, added, and untracked file. Do not skim — the commit message must reflect what actually changed.

### 2. Identify the plan phase

If the work was driven by a plan in `_plans/`, identify which phase it belongs to (e.g. `Phase 1: Site Shell & Theme`). The phase name goes in the commit message subject line.

If there is no plan phase, write a subject line that summarises the change directly.

### 3. Draft the commit message

**Subject line** — short, imperative, references the plan phase when applicable:

```
Phase 1: Add base layout, dark theme tokens, and content-collections wiring
```

**Body** — a few lines explaining *what changed* across the diff. Group related changes. Skip the "why" only if it is obvious from the subject; otherwise include it.

Do **not** add a `Co-Authored-By` trailer.

### 4. Stage and commit

Stage files explicitly by name. Never use `git add -A` or `git add .` — they can sweep in secrets or stray files.

Skip anything that looks like a secret (`.env`, `credentials.*`, key files). If something suspicious is staged, stop and ask the user.

Use a HEREDOC so the message formats cleanly:

```bash
git commit -m "$(cat <<'EOF'
Phase 1: Add base layout, dark theme tokens, and content-collections wiring

- Wire shadcn theme tokens into globals.css
- Add root layout with header/footer shells
- Configure content-collections for posts and projects
EOF
)"
```

If a pre-commit hook fails, fix the underlying issue and create a **new** commit. Do not `--amend` and do not pass `--no-verify`.

### 5. Push

After the commit succeeds, push to the remote:

```
git push
```

If the branch has no upstream, set one:

```
git push -u origin <current-branch>
```

If the push is rejected (non-fast-forward), stop and report back — do not force-push.

### 6. Report

Print the commit SHA, subject line, and confirm the push succeeded.
