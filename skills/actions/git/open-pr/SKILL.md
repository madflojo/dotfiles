---
name: open-pr
description: Review current-branch changes and open a GitHub pull request using gh. Use when the user asks to open/create a PR, prepare a PR title/body, or summarize changes for review.
license: Apache-2.0
compatibility: Requires git and GitHub CLI (gh).
metadata:
  source: .prompts/open-pr.md
  version: "1.0"
---

# Create a Pull Request for Current Branch

Review changes on the current branch and open a pull request using GitHub CLI (`gh`).
This skill is useful when the user asks to open/create a PR, prepare a PR title/body, or summarize changes for review.

## Review Git State

- Show remotes:
```bash
git remote -v
```

- Show current branch:
```bash
git rev-parse --abbrev-ref HEAD
```

## Review Changes

Use the upstream base if set; otherwise fall back to `origin/main`.

- Show commits since base:
```bash
git --no-pager log --oneline --decorate --no-merges \
  "$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo origin/main)..HEAD"
```

- Show diff summary (files/lines changed):
```bash
git --no-pager diff --stat \
  "$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo origin/main)..HEAD"
```

## Create the PR

Some agent environments are sandboxed and may not allow writing to `/tmp`. Prefer piping the PR body over stdin using `--body-file -`.

- Create the PR (edit placeholders as needed). Prefer feeding title/body over stdin to avoid shell escaping/history expansion issues such as `!`:
```bash
TITLE='<type(scope): subject // ≤100 chars; optional 1 emoji at end>'

gh pr create \
  --base "$(rev=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo origin/main); printf %s "${rev#*/}")" \
  --head "$(git rev-parse --abbrev-ref HEAD)" \
  --title "$TITLE" \
  --body-file - <<'EOF'
## Summary
<Brief purpose and outcome. What problem does this solve?>

## Changes
- <Change 1>
- <Change 2>

## Rationale
<Why these changes were necessary.>

## Risk & Impact
- Breaking changes: <yes/no + details>
- Performance/Security: <notes>
EOF
```
- If the environment doesn’t support stdin/heredocs, prefer `gh pr create --body-file <path>` using a repo-local file (avoid `/tmp`), or as a last resort use a short `--body` string (avoid `!`).

## Rules

- Title: Use Conventional Commits `type(scope): subject`; ≤100 chars; no leading emoji; optional one emoji at the end.
- Description: Summarize what changed and why; include risk/impact as bullets.
- Style: Professional, a bit lighthearted, concise; at most 1 emoji in title and ≤2 in body.
