# Personal Agent Instructions

## Table of contents

- [Loading and routing](#loading-and-routing)
- [Universal rules](#universal-rules)
- [Working style](AGENTS-working-style.md)
- [Delivery workflow](AGENTS-workflow.md)
- [Validation](AGENTS-validation.md)
- [Review and P.R.O.M.S.](AGENTS-review.md)
- [Architecture decisions](AGENTS-architecture.md)
- Local additions: `AGENTS-local.md` (optional, untracked)

## Loading and routing

Resolve this file's symlink target. Resolve all companion paths beside that canonical file, never from the current working directory. Companion filenames do not imply automatic loading.

Always read [working style](AGENTS-working-style.md) and `AGENTS-local.md` when present. Local guidance supplements shared policy; keep it untracked, locally ignored, and free of duplicated shared rules.

Section links require that section and its explicit prerequisites; file links require the full file. Read required guidance before its first dependent action. Load additional modules when scope changes; do not load every module by default. On resume, recheck scope, required guidance, authorization, and evidence applicability.

| Trigger | Required guidance |
| --- | --- |
| Change code or configuration; perform external writes | [Workflow](AGENTS-workflow.md), [validation](AGENTS-validation.md), [review](AGENTS-review.md) |
| Assess or recommend a non-trivial plan, design, or other deliverable; review existing work | [Review](AGENTS-review.md); [validation](AGENTS-validation.md) when judging checks or readiness |
| Change documentation or other artifacts | [Environment](AGENTS-workflow.md#environment-and-isolation), [build sequence](AGENTS-workflow.md#build-sequence), [increment sizing](AGENTS-workflow.md#change-sizing-and-planning-artifacts), [documentation](AGENTS-workflow.md#documentation), [validation](AGENTS-validation.md), [review](AGENTS-review.md) |
| Review code | [Engineering standards](AGENTS-workflow.md#engineering-standards), [review](AGENTS-review.md); [validation](AGENTS-validation.md) when judging checks |
| Review documentation or rendered artifacts | [Documentation](AGENTS-workflow.md#documentation), [review](AGENTS-review.md); [validation](AGENTS-validation.md) for rendering/check claims |
| Prepare a delivery plan | [Build sequence](AGENTS-workflow.md#build-sequence), [increment sizing](AGENTS-workflow.md#change-sizing-and-planning-artifacts), [ADR criteria](AGENTS-architecture.md#architecture-decisions), [review](AGENTS-review.md) |
| Assess current upstream state | [Environment](AGENTS-workflow.md#environment-and-isolation) |
| Determine whether an ADR is needed; assess a durable architectural choice | [Architecture](AGENTS-architecture.md), [review](AGENTS-review.md) |
| Run or interpret checks; claim verified results | [Validation](AGENTS-validation.md), [environment](AGENTS-workflow.md#environment-and-isolation) |
| Evaluate corrections, missing capabilities, reusable failures, or recurring improvements | [Workflow: continuous improvement](AGENTS-workflow.md#continuous-improvement) |

If required guidance is missing or unreadable, report the path and block dependent actions. Continue unaffected work. An absent optional local file is normal.

## Universal rules

- Follow explicit repository conventions over this personal workflow. Repository conventions do not authorize commits, pushes, PR creation, or merges; require user authorization for those actions.
- Inspect repository status and remotes before synchronizing or editing. Preserve user-owned edits, deletions, scope, branches, worktrees, and untracked files.
- Separate verified facts from inference, proposals, and unknowns. Name material evidence gaps and source dates or revisions. Never report blocked or unrun verification as success.
- Use the `caveman` skill for concise interactions and `learn-this-project` for repository discovery. Keep persisted guidance in normal prose; compress repetition without weakening obligations, exceptions, or authority.
- Read relevant repository instructions, tool configuration, and installed skills before acting. Repository-specific rules and pinned tooling take precedence over generic guidance.
