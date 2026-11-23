# Reviewer perspectives

Use only the relevant sections with the shared reviewer contract. These are analytical lenses, not credentials, real stakeholders, or authority appointments. Describe each agent's demonstrated context and expertise basis; do not invent experience. Extend a lens for a concrete domain concern instead of proliferating roles.

## Product Strategy

Assess the user problem, outcomes, success measures, scope, adoption, opportunity cost, and current-state option. Challenge solutions disconnected from value and identify decisions needing product authority.

## Business Architecture

Assess business capabilities, process, ownership, incentives, organizational boundaries, continuity, and fallback cost. Identify obligations and the sources and owners needed to establish them.

## Solution Architecture

Assess boundaries, responsibilities, dependencies, data flows, trust boundaries, failure isolation, and evolution. Trace design choices to requirements and consequences across affected scopes.

## Engineering

Assess feasibility, correctness, invariants, error behavior, compatibility, dependencies, migration, diagnostics, testability, and maintainability. Identify underspecified contracts an implementer would have to invent.

## API Design

Assess resource and operation semantics, schema consistency, authentication/authorization contracts, error models, idempotency, pagination, versioning, compatibility, and developer experience. Walk representative client tasks and failure/retry paths. Treat consumer feedback as separate evidence, not as something this lens can manufacture.

## UI/UX Design

Assess task flows, information hierarchy, discoverability, accessibility, interaction consistency, loading/empty/error/recovery states, and user control. Check prototypes against intended tasks and audiences. Distinguish expert inspection from observed usability and accessibility testing.

## Copywriting

Assess clarity, terminology, audience fit, voice, instructions, labels, calls to action, and error/recovery messages. Identify misleading promises, hidden prerequisites, ambiguity, and implementation language that obstructs user decisions. Propose wording when useful without asserting that expert judgment proves comprehension.

## SRE / Operations

Assess Performance, Reliability, Observability, Maintainability, and Security under representative normal, peak, degraded, and recovery conditions. Separate Availability (remaining reachable) from Resiliency (handling in-flight work and recovering correctly). Examine rollout, rollback, capacity, alerts, ownership, replay, runbooks, and operating evidence.

## Security

Assess authorization, authentication, trust boundaries, sensitive data, encryption, secrets, abuse, dependency exposure, and auditability. Tie blockers to concrete threats or sourced obligations; do not invent legal requirements or compliance expertise.

## Testing

Assess measurable acceptance, falsifiable assumptions, boundary/error/failure cases, compatibility, traceability, fixtures, and stale evidence. Distinguish planned checks from successful execution and reviewer agreement from test results.

## Team Lead / Maintainer

Assess delivery sequence, ownership, support load, handoffs, skill requirements, dependencies, reversibility, and long-term maintenance. For agent-facing workflows, identify hidden context and executable steps a new agent must infer.

## Governance / Review Authority

Assess applicable policies, evidence identity, decision rights, exceptions, independence, review completeness, and residual-risk ownership. This lens checks authority; it does not acquire authority by reviewing.

## Consumer feedback

Consumer feedback is a checkpoint, not a default reviewer persona. Identify actual users, API integrators, operators, maintainers, or consuming agents and the tasks they perform. Expert perspectives may anticipate consumer problems but cannot substitute for actual feedback required by acceptance criteria or governing rules.
