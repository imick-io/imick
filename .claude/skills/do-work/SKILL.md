---
name: do-work
description: Execute a unit of work end-to-end: plan, implement, and validate with typecheck and tests. Use when user wants to do work, build a feature, fix a bug, or implement a phase from a plan.
---

# Do Work

Execute a complete unit of work: plan it, build it, validate it. Stop before committing so the user can review.

## Workflow

### 1. Understand the task

Read any referenced plan or PRD. Explore the codebase to understand the relevant files, patterns, and conventions. If the task is ambiguous, ask the user to clarify scope before proceeding. 

### 2. Plan the implementation (optional)

If the task has not already been planned, create a plan for it. 

### 3. Implement

**For backend code**, use red/green/refactor one slice at a time:

1. **Red** — write one failing test for the smallest useful behaviour. Run it, confirm it fails for the right reason.
2. **Green** — write the minimum production code to make that test pass. Run it, confirm green.
3. **Refactor** — clean up without changing behaviour. Run tests again to stay green.
4. Repeat from step 1 for the next behaviour.

Do not write the next test until the current slice is green. Do not write more production code than the current failing test demands.

**For frontend code**, skip the red/green/refactor cycle and implement directly — UI behaviour is validated by running the dev server and testing in the browser.

Work through the plan step by step regardless of frontend or backend.

### 4. Validate

Run the feedback loops and fix any issues. Repeat until both pass cleanly.

```
pnpm run typecheck
pnpm run test
```

Once typecheck and tests pass, stop and report back. Do not commit — the user will review the changes first.
