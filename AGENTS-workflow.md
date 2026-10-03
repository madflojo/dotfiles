# Delivery Workflow

## Table of contents

- [Environment and isolation](#environment-and-isolation)
- [Build sequence](#build-sequence)
- [Change sizing and planning artifacts](#change-sizing-and-planning-artifacts)
- [Engineering standards](#engineering-standards)
- [Documentation](#documentation)
- [Continuous improvement](#continuous-improvement)
- [External writes](#external-writes)

Read [validation](AGENTS-validation.md) and [review](AGENTS-review.md) before changing artifacts. Read [ADR criteria](AGENTS-architecture.md#architecture-decisions) during scoping. Section-only loads require their linked prerequisites.

## Environment and isolation

- Check OS and architecture before building or running platform-sensitive software.
- Prefer repository targets: `make build`, `tests`, `benchmarks`, `format`, `lint`, and `clean`. Use `make -C <pkg> tests` for package checks.
- Check for `dev-compose.yml`; use Docker when dependencies or CI parity make isolation useful.
- Use `gh` for GitHub work and `act` for local GitHub Actions checks.
- Follow repository branch conventions; otherwise use `feature/`, `bugfix/`, or `hotfix/`, overriding harness defaults where permitted.
- Inspect repository status and remotes before synchronizing or editing; preserve user-owned changes, untracked files, branches, and worktrees.
- When upstream state matters, identify and fetch the authoritative remote; verify exact revision or ancestry before assessment or changes. If the checkout is dirty, use a clean worktree or temporary clone.
- When multiple initiatives are active, isolate each initiative in its own branch and worktree.
- Create worktrees in unique OS-managed temporary directories (`mktemp -d`), outside the repository, its parent, and home. Record exact paths. When safely complete, remove or archive through Git or managed tooling; never delete a broad temporary root.
- Give editing sub-agents explicit file ownership and separate worktrees; never let concurrent writers share a checkout.

Follow repository artifact, versioning, approval, and delivery conventions. Git publication still requires user authorization.

## Build sequence

1. **Discover and scope:** inspect conventions and decisions; define behavior and acceptance criteria. Apply [ADR criteria](AGENTS-architecture.md#architecture-decisions).
2. **Decide architecture when needed:** prepare a separate ADR PR before implementation. Review alternatives and consequences with Systems architect and, for system design, SRE/P.R.O.M.S. Wait for human acceptance and ADR merge unless repository lifecycle explicitly differs. Agent review is evidence, not approval. Without publication authority, prepare the ADR and report the pending gate. Skip this stage for accepted decisions.
3. **Interface-driven design (IDD):** specify behavior, inputs, outputs, errors, compatibility, and failure boundaries before implementation. Use Senior engineer and relevant consumer perspectives. Review the contract independently before building; reference applicable accepted ADRs.
4. **Plan delivery:** define coherent, testable increments and their verification. Carry applicable P.R.O.M.S. criteria. Use Team Lead for sequencing/coordination risks; follow repository plan conventions.
5. **Test-driven development (TDD):** follow [baseline, red, green, and refactor](AGENTS-validation.md#tdd-flow) for behavior changes. Cover happy, error, boundary, and regression cases. Do not add public surface solely for tests. Use [task-specific verification](AGENTS-validation.md#task-specific-verification) for refactors, configuration, and documentation.
6. **Review and verify:** check each coherent increment and simplify/harden its diff. Use the relevant independent reviewer; SRE covers behavior and non-functional evidence when P.R.O.M.S. applies. Fix in-scope findings and rerun checks. Reassess an ADR only for new architectural choices.
7. **Deliver:** report behavior, verification, and unresolved risks. Authorized implementation PRs reference accepted ADRs and versioned plans. Keep implementation separate from ADR PRs; ADR acceptance does not authorize implementation merge.

Follow [independent review stages](AGENTS-review.md#independent-review-stages) before moving beyond each applicable major step.

## Change sizing and planning artifacts

- Use the smallest coherent, independently reviewable/testable increments. Each needs one purpose, a bounded diff, acceptance criteria, and focused verification.
- Keep increments independently mergeable or reversible where practical. Exclude unrelated refactors, features, and initiatives.
- Follow repository conventions for plans, specifications, ledgers, and planning notes. Commit only with user authorization. Without conventions, keep them outside tracked paths or in an existing ignored workspace unless explicitly asked to version them; do not stage or commit by default.

## Engineering standards

- Use installed style, language, and framework skills relevant to touched files and boundaries; follow root precedence rules.
- Use standard formatters, import organizers, linters, analyzers, and type checkers through repository runners. Do not substitute personal formatting.
- Follow ecosystem indentation conventions; default to 2 spaces only when the language or repository has no stronger convention, use 4 spaces for Python, and tabs for Makefiles.
- Prefer descriptive names, cohesive modules, minimal public surface area, and explicit contracts; use short names only in tiny scopes.
- Test boundary behavior with idiomatic table-driven/parameterized tests where appropriate. Cover happy, error, boundary, and regression cases. Use mocks/fakes only at controlled boundaries; no BDD frameworks or Gherkin.
- Keep tests deterministic: readiness signals, synchronization, and bounded condition checks replace arbitrary sleeps/timing-dependent polling. Prefer isolated dynamic resources, such as ephemeral ports, over fixed shared resources.
- Handle errors/logging idiomatically. Preserve causes and context; expose stable error contracts when consumers need them. Never leak secrets or sensitive data.
- Document public behavior and non-obvious decisions, especially compatibility, performance, security, or operational tradeoffs; do not narrate obvious code.
- Benchmark or profile performance-sensitive paths with representative workloads instead of relying on intuition.
- Follow [validation requirements](AGENTS-validation.md) before committing.

## Documentation

- Write for the intended audience, avoid unnecessary jargon, and explain unavoidable domain terms simply.
- Preserve intentional user edits, deletions, scope, and structure; do not restore or narrow material merely because supporting details are incomplete, and label unknowns explicitly.
- Preserve operational meaning, direction, causality, concurrency, and active states when simplifying rendered artifacts. Inspect output before claiming correctness.
- Before finishing documentation, remove repetition, tighten long passages, and check that different audiences can find the decision and its consequences.
- Select and name documentation review lenses from the reviewer persona index according to the audience and risk. Routine documentation uses a bounded intended-reader clarity and accuracy review, combining applicable major steps into one adversarial review rather than a panel. For substantial architecture documentation, include the intended reader and relevant technical perspectives; reconcile conflicting recommendations against the audience and goal.

## Continuous improvement

- Use `self-improvement` for corrections, outdated knowledge, missing capabilities, completed failures with reusable lessons, and better recurring approaches. Review relevant learnings before major work.
- Write a durable learning only to an established ignored local learning store or when the user authorizes the write; otherwise report the candidate learning without creating unrelated files.
- Use `self-healing` instead for an unexpected, task-blocking runtime or tool failure whose repair is within the authorized scope; do not invoke it for expected negative tests or use it to broaden the task, and pass recurring verified patterns to `self-improvement` afterward.
- Search existing learning entries before adding one, link or update related patterns instead of duplicating them, and never record secrets, credentials, personal data, or unrelated sensitive context.
- Keep learnings concise and actionable. Promote recurring, broadly useful patterns only when the skill's promotion threshold is met and the user has authorized the durable policy or memory change.

## External writes

- Use the `fun-commit-msg` and `fun-pull-requests` skills when creating commits or pull requests.
- After comments, issue creates/edits, ticket transitions, or PR creates/edits, capture the canonical URL/ID and read back remotely.
- Verify stored title, body, comment text, links, formatting, labels, assignee, and status as applicable. Command/API success alone is insufficient.
- Correct empty, truncated, malformed, or otherwise incorrect content and read it back again before reporting success.
- If remote verification is unavailable or still fails, report the action as unverified.
