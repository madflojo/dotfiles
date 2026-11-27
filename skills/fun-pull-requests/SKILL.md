---
name: fun-pull-requests
description: >-
  Prepares and publishes a polished GitHub pull request with `gh`, including
  PR title and body drafting, branch review summaries, draft-vs-ready
  guidance, and `gh pr create` workflows. Use when the task involves opening,
  drafting, publishing, or summarizing a GitHub pull request for the current
  branch.
license: Apache-2.0
compatibility: Requires git and GitHub CLI (gh). Best with an authenticated gh session and a cloned GitHub repository.
metadata:
  author: "Benjamin Cane"
  repository: "fun-pull-requests"
  tags:
    - github
    - pull-requests
    - publishing
    - review
---

# Fun Pull Requests

Prepare the current branch for review and open a polished GitHub pull request
with `gh`. The result should be concrete, accurate, and easy for reviewers to
scan, with a little personality where it helps and none where it hurts.

Add a little bit of contextual humor to the PR, not much, just enough that a
reviewer might crack a small smile while the title and summary stay relevant
and professional.

Use this skill when the user wants to:

- open or publish a pull request
- draft a PR title and body
- summarize branch changes for review
- convert local branch state into a review-ready GitHub PR flow

## Working Style

- Be accurate before being playful. The PR should stay professional and factual.
- Keep tone concise and human. Add a small amount of contextual humor, but keep
  it subordinate to the technical content.
- Review the branch state before proposing a title or body.
- Do not assume upstreams, remotes, auth, or default branches are configured.
- Scope tool use to repo-local `git` inspection and `gh` PR operations. Prefer
  `gh` for repository and PR operations, and fall back to raw git only when
  that improves reliability or when `gh` cannot provide the needed detail.

## Preflight

Start by checking whether the repository and CLI state can support PR creation.

### 1. Confirm repository state

```bash
git rev-parse --show-toplevel
git rev-parse --is-inside-work-tree
git remote -v
git rev-parse --abbrev-ref HEAD
git status --short
```

### 2. Confirm GitHub CLI auth

```bash
gh auth status
```

If `gh auth status` fails or shows no usable GitHub account:

- stop before attempting `gh pr create`
- tell the user authentication is required
- suggest `gh auth login`

### 3. Confirm the repo is visible to gh

Prefer:

```bash
gh repo view --json nameWithOwner,defaultBranchRef
```

If that fails because the local repo is not associated with a GitHub remote:

- inspect `git remote -v`
- if there is no usable GitHub remote, tell the user the branch cannot be
  published until a GitHub remote exists
- if there is a GitHub remote but `gh repo view` still fails, report that and
  fall back to git-only inspection for local summary work

## Resolve the Base Branch

Never hardcode `main` unless every better signal fails.

Resolve the base branch in this order:

1. Current branch upstream target, if it exists and points at a remote branch.
2. Repository default branch from `gh repo view --json defaultBranchRef`.
3. Remote HEAD from git, for example `refs/remotes/origin/HEAD`.
4. `origin/main`, then `origin/master`, but only as explicit last-resort
   guesses.

Useful commands:

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u}
gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'
git symbolic-ref --quiet refs/remotes/origin/HEAD
git branch -r
```

When converting a remote ref into a base branch name, strip the remote prefix so
`origin/main` becomes `main`.

If you still cannot determine a credible base branch, stop and tell the user
which signals were missing instead of guessing.

## Review the Current Branch

After the base branch is known, inspect what the PR will contain.

```bash
BASE_REF="<resolved-remote-base-ref>"

git --no-pager log --oneline --decorate --no-merges "${BASE_REF}..HEAD"
git --no-pager diff --stat "${BASE_REF}..HEAD"
git --no-pager diff --name-status "${BASE_REF}..HEAD"
```

Use the inspection results to draft the PR summary. Mention meaningful behavior
changes, reviewer risks, follow-up work, and any test or validation status that
the user already has.

## No-Upstream Behavior

If the current branch has no upstream:

- say so explicitly
- do not pretend a PR can be opened until the branch exists on a remote
- prefer pushing the current branch with upstream tracking before PR creation

Typical flow:

```bash
git push -u origin HEAD
```

If the remote is not `origin`, use the correct remote name discovered during
preflight.

If the user asked only for a draft title/body, you can still prepare the PR
content locally without pushing. If they asked to actually publish the PR, the
branch must be pushed first.

## Draft vs Ready Guidance

Choose draft status intentionally.

Prefer a draft PR when:

- implementation is still in progress
- tests are incomplete or knowingly failing
- feedback is wanted on direction before final polish
- follow-up commits are expected before merge review

Prefer a ready PR when:

- the requested scope is implemented
- known blockers are resolved or clearly disclosed
- the branch is ready for normal review

If the user did not specify and the branch looks incomplete, default to draft
and explain why. If the branch appears complete, default to a ready PR.

## Create the PR

Prefer piping the body over stdin with `--body-file -` so you avoid shell
escaping issues and temporary-file assumptions.

Template:

```bash
BASE_BRANCH="<resolved-base-branch>"
HEAD_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
TITLE="<type(scope): short subject>"

gh pr create \
  --base "${BASE_BRANCH}" \
  --head "${HEAD_BRANCH}" \
  --title "${TITLE}" \
  --body-file - <<'EOF'
## Summary
<What changed and why it matters.>

## Changes
- <Meaningful change 1>
- <Meaningful change 2>

## Validation
- <Tests run, or "Not run">

## Risks
- <Known risk, follow-up, or "None noted">
EOF
```

For a draft PR:

```bash
gh pr create --draft ...
```

## gh Fallback Behavior

Prefer `gh` for the actual PR creation, but handle failures cleanly.

If `gh pr create` fails:

1. Read the error and determine whether it is caused by auth, missing remote
   branch, missing repo association, or permission problems.
2. Fix the prerequisite if it is safe and clearly requested, such as pushing the
   branch first.
3. If creation still cannot proceed, provide the prepared title and body to the
   user so they can create the PR manually.

Reasonable fallbacks:

- use `gh pr create --web` if CLI submission fails but browser-based creation is
  acceptable
- use a repo-local temporary file with `--body-file <path>` if stdin or heredoc
  behavior is unreliable in the environment
- fall back to raw git only for inspection and branch publishing, not for PR
  creation itself

Avoid `/tmp` if the environment may be sandboxed or ephemeral.

## Title and Body Rules

- Prefer conventional-commit-style titles such as `feat:`, `fix:`, `docs:`, or
  `refactor:`.
- Keep titles short, concrete, and reviewer-oriented.
- Add a little bit of contextual humor to the PR title or summary, not much,
  just enough that it feels human while still reading cleanly in release notes
  and GitHub history.
- When the change is low-risk, docs-focused, or otherwise light in tone, the
  humorous touch can be more visible.
- Body content should explain outcome, notable changes, validation status, and
  risk.
- Include a brief playful phrase in the summary when the title stays straight,
  or keep the summary mostly straight when the title already carries the wink.
- Do not hide missing tests or known issues behind humor.
- For risky, sensitive, or user-impacting changes, keep the humor understated
  and feel free to skip it entirely if that serves clarity better.

Examples of good lighter-touch titles:

- `docs: add gh skill install guidance without the side quest 🗺️`
- `refactor(ci): trim release wiring before it grows a second head`
- `docs(readme): clarify local setup before the yak gets involved`
- `docs: tune PR copy so release notes keep their tie on`

Examples of good lighter-touch summary lines:

- `Document the new install flow so readers can get to the good part without`
  `spelunking through setup docs.`
- `Tighten the release steps so future updates feel more like a routine and`
  `less like archaeology.`

Examples of when to stay fully straight:

- `fix(auth): handle expired token refresh before retries`
- `security: rotate leaked development credentials`
- `fix(api): preserve webhook signature verification on retries`

Examples of understated humor for serious changes:

- `fix(auth): handle expired token refresh before retries`
  Summary: `Keep token refresh failures from turning login into a trust fall.`
- `security: rotate leaked development credentials`
  Summary: `Replace exposed credentials and close the window before it becomes`
  `a skylight.`

If the wording starts reading like stand-up material, pull it back.

## Output Expectations

When helping the user, provide:

- the resolved base branch and how it was determined
- a short summary of the branch contents
- the proposed PR title
- the proposed PR body
- whether the PR should be draft or ready, with reasoning
- the exact `gh pr create` command if the user wants to run or review it
