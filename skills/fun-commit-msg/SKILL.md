---
name: fun-commit-msg
description: >-
  Generates polished Conventional Commit messages with a light, contextual wink
  and performs safe non-interactive git commits for already-reviewed changes.
  Use when the task involves committing changes, drafting a git commit message,
  applying Conventional Commits, or turning a coherent staged diff into a
  final commit without disturbing the user's staging choices.
license: Apache-2.0
compatibility: Requires git.
metadata:
  author: Benjamin Cane
  repository: fun-commit-msg
---

# Fun Commit Message

Use this skill when the user wants help committing work, needs a Conventional
Commit message, or wants the agent to turn staged changes into a clean commit
without fighting the shell.

Add a little bit of contextual humor to the commit message, not much,
just a little bit to where if someone reads it, they might chuckle,
but the message is still relevant and professional.

## When to Use

Use this skill when:

- the user asks to commit changes
- the user wants a commit message suggestion
- the user wants Conventional Commit formatting help
- staged changes already represent a coherent commit

Do not use this skill to decide broad staging strategy for a messy worktree
without confirming intent first.

## Tool Scope

Use the git CLI and basic shell commands needed to inspect the repository,
review the staged diff, and create the commit safely.

Do not reach for extra tools or editors when `git status`, `git diff`,
`git rev-parse`, and `git commit` cover the task.

## Operating Rules

1. Inspect before writing.
   - Review staged changes before proposing a message.
   - Prefer `git --no-pager diff --staged` and `git diff --staged --stat`.

2. Respect the user's staging boundary.
   - Treat the staged set as the intended commit unless the user explicitly asks
     you to stage more.
   - If nothing is staged, ask before staging files.
   - If the worktree contains a mix of staged and unstaged changes, do not
     silently stage everything.

3. Keep the commit message truthful.
   - Summarize what actually changed, not what the code was supposed to do.
   - Do not claim tests passed unless you verified that separately.

4. Prefer shell-safe commit flows.
   - Use stdin with `git commit -F -` for messages that may contain quotes,
     backticks, `!`, or multiple lines.
   - Avoid `git commit -m` for complex messages.

5. Stop on commit blockers.
   - If the repo is not a git repository, say so and do not proceed.
   - If there are no staged changes, ask how the user wants to proceed.
   - If hooks reject the commit, surface the hook failure and the relevant
     output instead of retrying blindly.

## Execution Protocol

Work in this order:

- Confirm git context.
  - Check that the current directory is inside a git worktree:
    `git rev-parse --is-inside-work-tree`

- Review the staged set.
  - Show the staged diff summary:
    `git --no-pager diff --staged --stat`
  - Read the staged diff when needed:
    `git --no-pager diff --staged`

- Check for staging edge cases.
  - If nothing is staged, ask whether to stop or stage specific files.
  - If partially staged files exist, summarize that fact and avoid changing the
    staging area unless the user asked for it.
  - If there are unrelated unstaged changes, ignore them unless they make the
    staged diff misleading.

- Draft the commit message.
  - Use Conventional Commits format:
    `<type>(<scope>): <subject>`
  - Omit the scope when it adds noise.
  - Keep the scope when the change is clearly isolated or the project
    convention is to always include scopes.
  - Keep the subject at or under 100 characters.
  - Use a body only when the change is not obvious from the subject.

- Commit non-interactively.
  - Preferred form:

```bash
git commit -F - <<'EOF'
<type(scope): subject>

<optional body>
EOF
```

- Report the result.
  - Surface the created commit hash and subject.
  - If the commit failed, summarize the failure and next blocking action.

## Message Rules

- Use a Conventional Commit type that matches the dominant change:
  `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, `chore`, `perf`.
- Mention issue or task references only when they are already present in the
  context.
- Prefer a one-line commit for small changes.
- Use a short body for non-trivial changes, behavior changes, or important
  rationale.
- Never lead with an emoji, but feel free to add one emoji at the end
  of the subject if it fits naturally.
- Add a little bit of contextual humor to the commit message, not much, just
  a little bit to where if someone reads it, they might chuckle, but the
  message is still relevant and professional.

## Failure Modes

- Not a git repo:
  explain that committing is not possible from the current directory.
- No staged changes:
  ask whether to stop or stage specific files.
- Partially staged files:
  mention them and preserve the current staging boundary.
- Commit hook failure:
  report the hook output and do not rewrite history or bypass hooks unless the
  user explicitly asks.
- Merge conflict or rebase state:
  describe the repo state and avoid creating a normal commit until the user
  confirms the intended flow.

## Output Expectations

When asked for a message only:

- provide 1 to 3 strong commit message options
- keep each option truthful to the diff
- note the recommended option first

When asked to perform the commit:

- show the chosen message
- run the commit safely
- report success or the exact blocker

## Reference

Load `references/MESSAGES.md` only when you need extra commit-message
heuristics or examples beyond the workflow in this file.
