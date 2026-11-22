# Delivery Workflow

## Table of contents

- [Environment and isolation](#environment-and-isolation)
- [Local checkpoints](#local-checkpoints)
- [Build sequence](#build-sequence)
  - [Shape and plan](#shape-and-plan)
  - [Build and verify](#build-and-verify)
- [Change sizing and planning artifacts](#change-sizing-and-planning-artifacts)
- [Engineering standards](#engineering-standards)
- [Documentation](#documentation)
- [Skill maintenance](#skill-maintenance)
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
- Create worktrees in unique OS-managed temporary directories (`mktemp -d`), outside the repository, its parent, and home. Record exact paths. Treat these directories as disposable and subject to cleanup on reboot; preserve work through local checkpoints in the surviving shared repository. When safely complete, remove or archive through Git or managed tooling; never delete a broad temporary root.
- Give editing sub-agents explicit file ownership and separate worktrees; never let concurrent writers share a checkout.

Follow repository artifact, versioning, approval, and delivery conventions. Git publication still requires user authorization.

## Local checkpoints

- Local checkpoint commits are pre-authorized for work within the user's requested scope unless the user or repository explicitly restricts them. Commit frequently after coherent milestones, accepted revisions, and before pausing, handing off, or ending a work session with changes. Do not wait for the entire task to finish.
- Keep checkpoints on a named task branch whose shared Git repository lives outside temporary storage. A temporary checkout may disappear on reboot; recreate it from that branch. Local commits do not protect against loss of the shared repository or disk.
- Inspect and stage only task-owned changes, including new drafts, source files, diagrams, and required assets. Preserve unrelated edits and partial staging; never blanket-stage a mixed checkout or include secrets, caches, or dependencies.
- Keep required recovery inputs and reusable helpers inside the worktree and track them. Preserve intentionally ignored or unversioned working notes separately in durable local storage when needed; do not rely on sibling files in the temporary parent directory. Follow repository artifact conventions without committing disposable plans by default.
- Validate completed increments normally. If work must pause before checks or review finish, make an explicitly labeled `WIP` checkpoint recording failed, blocked, or unrun checks and remaining work. This preserves progress; it does not satisfy delivery, review, or merge gates. Do not bypass hooks to force a checkpoint; report the blocker and preserve a durable local snapshot instead.
- Verify the commit and branch reference, then inspect remaining modified and untracked files for task work that was missed. Report the checkpoint hash and any remaining exposure. Checkpoint authorization does not authorize pushes, PRs, merges, or publication.

## Build sequence

Follow the [independent review stages](AGENTS-review.md#independent-review-stages) and [evidence checkpoints](AGENTS-validation.md#evidence-checkpoints). Small, reversible changes may combine applicable design, planning, and review steps.

### Shape and plan

1. **Capture requirements.** Inspect repository conventions and accepted decisions. Define the outcome, constraints, and acceptance criteria. Sketch a target outline with rough sequencing, dependencies, and feasibility risks.
2. **Design at the applicable layers.** Use [architecture layers and contracts](AGENTS-architecture.md#architecture-layers-and-contracts). Apply interface-driven design (IDD) at each layer to settle the contracts downstream work depends on. Carry applicable P.R.O.M.S. criteria into the design and plan.
3. **Resolve decisions as they arise.** Apply the [ADR criteria and acceptance gate](AGENTS-architecture.md#architecture-decisions) at every layer. Reuse applicable accepted decisions. Without publication authority, prepare the ADR and report the pending gate.
4. **Plan delivery.** Turn the reviewed design and contracts into independently verifiable increments. Map each increment to dependencies, acceptance criteria, and checks. Include rollout and rollback steps where relevant.

### Build and verify

For each increment:

1. **Refine the contract (IDD).** Specify observable behavior, inputs, outputs, errors, compatibility, and failure boundaries from the relevant consumer perspectives. Settle deferred package or library contracts before writing tests.
2. **Run the TDD loop.** Follow [baseline, red, green, and refactor](AGENTS-validation.md#tdd-flow) for behavior changes. Cover relevant happy, error, boundary, and regression cases. Do not add public surface solely for tests. Use [task-specific verification](AGENTS-validation.md#task-specific-verification) for refactors, configuration, and documentation.
3. **Review and repeat.** Simplify and harden the diff. Check the completed increment against its contract and applicable P.R.O.M.S. criteria. Fix in-scope findings and rerun affected checks. If evidence invalidates a reviewed contract or architectural decision, return to shaping for the affected work and revise the plan.

Checkpoint each coherent increment and before pausing under [local checkpoints](#local-checkpoints).

**Deliver** with resulting behavior, verification evidence, and remaining risks. Authorized implementation PRs reference applicable accepted ADRs and versioned plans. Keep implementation separate from ADR PRs; ADR acceptance does not authorize implementation merge.

## Change sizing and planning artifacts

- Use the smallest coherent, independently reviewable/testable increments. Each needs one purpose, a bounded diff, acceptance criteria, and focused verification.
- Keep increments independently mergeable or reversible where practical. Exclude unrelated refactors, features, and initiatives.
- Reuse suitable existing artifacts. A bounded change can use an issue or short chat note. For larger work, choose artifacts by need:
  - **Requirements brief or PRD:** align stakeholders on goals, scope, and acceptance criteria. Keep the target outline here unless sequencing or feasibility needs a separate artifact.
  - **Design and contracts:** record boundaries others rely on in the usual location, such as a design doc, API schema, or package documentation. One design can cover several layers.
  - **ADR:** record a decision only when it meets the ADR criteria. Link to the design instead of repeating it.
  - **Feature or delivery plan:** record increments when work spans multiple steps or needs coordination. Use an issue, epic, or plan section for a feature as appropriate.
  - **Verification evidence:** summarize material checks in the task or PR. Create a separate tracked record only when required or requested.
- Follow repository conventions for plans, specifications, and evidence. Use `.plans/` only where established. Without conventions, keep working artifacts in chat, outside tracked paths, or in an existing ignored workspace unless explicitly asked to version them. Do not stage unversioned working artifacts. Apply the standing authorization and boundaries in [local checkpoints](#local-checkpoints).

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
- Keep audience-facing content focused on its subject. Exclude drafting history, prompt instructions, agent or tool orchestration, internal review personas, approval choreography, validation logs, and commentary about how the content was produced. Put authoring status and verification evidence in the task conversation or designated internal records instead.
- Include process details only when the user requests them, they are the subject the audience needs to understand, or a required disclosure applies. Preserve reader-relevant sources, methodology, limitations, and uncertainty; do not confuse these with internal authoring notes.
- Preserve intentional user edits, deletions, scope, and structure; do not restore or narrow material merely because supporting details are incomplete, and label unknowns explicitly.
- Preserve operational meaning, direction, causality, concurrency, and active states when simplifying rendered artifacts. Inspect output before claiming correctness.
- Before finishing documentation, remove repetition, tighten long passages, and check that different audiences can find the decision and its consequences.
- Select and name documentation review lenses from the reviewer persona index according to the audience and risk. Routine documentation uses a bounded intended-reader clarity and accuracy review, combining applicable major steps into one adversarial review rather than a panel. For substantial architecture documentation, include the intended reader and relevant technical perspectives; reconcile conflicting recommendations against the audience and goal.

## Skill maintenance

- Identify the maintained source and compare it with installed copies before changing a skill. Preserve useful local improvements, report drift, and follow the source's versioning and installation conventions. Do not silently overwrite either copy.
- Keep entrypoints concise: state triggers, core obligations, workflow, and direct links to supporting material. Move large templates and specialized detail into references or assets; give references over 100 lines a table of contents. Compression must preserve authority, exceptions, and failure handling.
- Match prescription to risk: allow judgment in analysis, use adaptable templates for prose, and specify exact sequences for fragile operations. Keep standalone skills usable without assuming this personal policy is installed.
- Check required tools, versions, authentication, and runtime limitations before use. Install dependencies only within authorized scope and supported environments; otherwise report a fallback or blocker.
- Validate behavior with [skill evaluations](AGENTS-validation.md#skill-evaluations), not only Markdown or link checks. Avoid adding scripts or dependencies when existing tools suffice.

## Continuous improvement

- Use `self-improvement` for corrections, outdated knowledge, missing capabilities, completed failures with reusable lessons, and better recurring approaches. Review relevant learnings before major work.
- Write a durable learning only to an established ignored local learning store or when the user authorizes the write; otherwise report the candidate learning without creating unrelated files.
- Use `self-healing` instead for an unexpected, task-blocking runtime or tool failure whose repair is within the authorized scope; do not invoke it for expected negative tests or use it to broaden the task, and pass recurring verified patterns to `self-improvement` afterward.
- Search existing learning entries before adding one, link or update related patterns instead of duplicating them, and never record secrets, credentials, personal data, or unrelated sensitive context.
- Keep learnings concise and actionable. Promote recurring, broadly useful patterns only when the skill's promotion threshold is met and the user has authorized the durable policy or memory change.

## External writes

- Use the `fun-commit-msg` and `fun-pull-requests` skills when creating commits or pull requests.
- Distinguish drafting content from publishing it. Reuse existing user authorization within its scope; do not infer push or publication authority from a request to draft text.
- For PRs, determine the intended integration base from explicit instructions, the existing PR, or repository conventions. A branch's tracking upstream is not necessarily its PR base. Use a merge-base/three-dot diff for PR file changes and a two-dot range for commit listing.
- Before retrying an ambiguous external create, inspect remote state for an already-created resource; avoid duplicate writes.
- After comments, issue creates/edits, ticket transitions, or PR creates/edits, capture the canonical URL/ID and read back remotely.
- Verify stored title, body, comment text, links, formatting, labels, assignee, status, and PR base/head as applicable. Command/API success alone is insufficient.
- Correct empty, truncated, malformed, or otherwise incorrect content and read it back again before reporting success.
- If remote verification is unavailable or still fails, report the action as unverified.
