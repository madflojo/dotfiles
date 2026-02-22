---
name: commit
description: Generate a Conventional Commit message and perform a git commit for staged changes. Use when the user asks to commit changes, wants a commit message, or needs Conventional Commits guidance.
license: Apache-2.0
compatibility: Requires git.
metadata:
  source: .prompts/commit.md
  version: "1.0"
---

# Perform a Git Commit for Staged Changes

## Tooling

### Viewing Staged Changes

Use:

```bash
git --no-pager diff --staged
```

If changes are not staged, ask the user to stage them or if they want to stage all changes with:

```bash
git add .
```

### Committing Changes

Commit non-interactively by reading the message from stdin (safe with `!`, quotes, backticks, and newlines):

```bash
git commit -F - <<'EOF'
<type(scope): subject>

<body (optional)>
EOF
```

Avoid passing commit messages via `-m` when the message may contain `!`, quotes, backticks, backslashes, or newlines.

## Rules

- If change is trivial (e.g., <100 lines changed, small edits), generate a single-line commit.
- If change is non-trivial, allow a concise multi-line commit.
- Always follow Conventional Commits format including adding issues, user stories, tasks, or defects references if available.
- Limit subject line to 100 characters max.

## Style

- Never start with an emoji; one emoji at the end of the subject is OK.
- Add a touch of contextual humor (just enough for a chuckle, but still relevant and professional).
- Title/subject: optionally append a single emoji at the end; Body: keep total emojis subtle (generally ≤2).
- If you’re forced to inline a message in a shell command, avoid shell-problematic characters (especially `!`). Otherwise prefer the stdin-based commit flow above.
