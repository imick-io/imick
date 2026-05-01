---
name: refine-prompt
description: Take a rough or unclear prompt and rewrite it into a clearer, more effective version. Use when user wants to improve a prompt, refactor a prompt, get a better version of their prompt, or says things like "make this prompt better", "improve this prompt", "help me write a prompt".
---

# Refine Prompt

Given a prompt from the user, output a refined version that is clearer, more specific, and more likely to produce the desired result.

## Process

1. Read the user's prompt (passed as ARGUMENTS or inline)
2. Identify the core intent: what outcome does the user actually want?
3. Diagnose weaknesses:
   - Ambiguous words or scope
   - Missing context the model needs
   - Unclear output format
   - Underspecified constraints
   - Vague action verbs ("help me", "make", "do")
4. Rewrite the prompt applying the improvements below
5. Output the refined prompt in a fenced code block, then explain the key changes in 3–5 bullet points

## Improvement principles

- **Specificity**: Replace vague terms with concrete ones. "Better" → "clearer and under 200 words"
- **Role/context**: Add a role or context frame when it helps ("You are a senior Go engineer...")
- **Output format**: State exactly what form the answer should take (list, table, code block, prose)
- **Scope**: Add constraints that prevent scope creep ("only change X, don't touch Y")
- **Examples**: If the intent is ambiguous, include a brief example in the prompt
- **One ask**: Split multi-intent prompts into focused single asks

## Output format

```
[refined prompt here — ready to copy-paste]
```

**What changed:**
- [change 1]
- [change 2]
- ...

## Notes

- Preserve the user's original intent — don't change what they're asking for, only how they ask it
- If the prompt is already clear and specific, say so and make only minor tweaks
- If ARGUMENTS contains the prompt, use it directly; if empty, ask the user to paste their prompt