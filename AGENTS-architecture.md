# Architecture Guidance

## Table of contents

- [Architecture decisions](#architecture-decisions)

Read [review](AGENTS-review.md) before architectural assessment. Its P.R.O.M.S. requirements apply to system-design ADRs.

## Architecture decisions

Use a plan for delivery within established architecture. Use an Architecture Decision Record (ADR) for the rationale behind a consequential architectural choice.

- Require an ADR only when choosing or changing a durable architectural direction, meaningful alternatives have material tradeoffs, and reversal would require substantial migration, coordination, or compatibility work. Examples include changing service boundaries, data ownership, persistence strategy, trust boundaries, or the deployment model.
- Merely touching a public API, dependency, security check, or deployment configuration does not require an ADR. Routine fixes, compatible extensions, refactors within existing boundaries, and implementation of an accepted decision normally need only a proportionate implementation plan; small changes can use a short in-chat plan.
- Size, file count, and sequencing alone do not require an ADR. If an existing ADR covers the choice, reference it and plan the implementation. Create both artifacts only when a new architectural decision and its execution each need explanation; avoid duplicating their content.
- For analysis or plan-only work, recommend an ADR only when these criteria are met and describe the decision without creating tracked files. Write an ADR only when implementation or documentation changes are authorized.
- Follow the repository's ADR template, location, and lifecycle; amend or supersede an accepted ADR instead of rewriting its history unless repository convention explicitly permits in-place revision.
- When no convention exists, use the next unused `docs/adr/NNNN-short-title.md` filename; include context, decision, alternatives, rationale, consequences, P.R.O.M.S. assessment for system design, and validation or revisit conditions.
- Use an ADR's constraints to shape the implementation contract and plan. Keep ADRs as durable repository documentation, accepted through the decision stage before their implementation.
