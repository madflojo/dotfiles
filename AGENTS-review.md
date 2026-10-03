# Review and Quality Gates

## Table of contents

- [Independent review stages](#independent-review-stages)
- [Reviewer persona index](#reviewer-persona-index)
- [Non-functional requirements: P.R.O.M.S.](#non-functional-requirements-proms)
- [Quality gates](#quality-gates)

## Independent review stages

Before each applicable major step proceeds, require one independent adversarial sub-agent review: scope and acceptance criteria (Product Owner), architecture (Systems architect and SRE when P.R.O.M.S. applies), interface contract (Senior engineer), delivery plan (Team Lead), completed TDD implementation increments (Senior engineer or SRE), and delivery readiness (Reviewer or approver). Challenge assumptions, simplicity, failure modes, evidence gaps, and residual risks. Combine implementation verification and delivery readiness in one review when they assess the same unchanged artifact; do not review every individual test or edit. Small, reversible changes may combine applicable steps into one bounded review and do not need an ADR or a review panel.

## Reviewer persona index

Select personas by decision or risk, not file type. They apply to requirements, architecture, contracts, plans, code, tests, operations, and documentation.

- A lens is a perspective, not a separate agent requirement. Use the independent stages and P.R.O.M.S. rules to determine required reviews.
- Give adversarial reviewer sub-agents the requirements, constraints, relevant artifact or diff, and verification evidence in fresh context, without the author's reasoning history. Ask them to challenge assumptions, find counterexamples and failure paths, and report evidence-backed findings by severity; do not ask them merely to confirm the approach.
- Use one reviewer at each required review stage, combining relevant lenses where practical. Design review does not replace review of the completed implementation. Reuse the stage's SRE review for P.R.O.M.S.; do not create duplicate reviews. Reviewers do not spawn reviewers. Use a panel only when the user explicitly requests it.
- Keep reviewers read-only. The author reconciles findings with requirements and evidence, fixes in-scope issues, and escalates unresolved material decisions. If sub-agents are unavailable, perform a direct review and disclose the limitation.

| Lens | Review focus |
| --- | --- |
| Junior engineer | Missing context, undefined terms, onboarding clarity, and steps that assume hidden knowledge. |
| Senior engineer | Correctness, maintainability, testability, operational tradeoffs, and needless complexity. |
| Principal Engineer | Organization-wide technical direction, durable standards, leverage, systemic risk, and long-term evolution. |
| Team Lead | Delivery feasibility, ownership, sequencing, team practices, support load, and day-to-day execution. |
| Systems architect | Boundaries, dependencies, failure modes, scalability, and decision consequences. |
| Enterprise Architect | Enterprise standards, cross-domain dependencies, reuse, governance, and target-state alignment. |
| Security or compliance | Data handling, permissions, misuse cases, controls, and auditability. |
| Operator or SRE | Deployment, observability, recovery, support burden, and degraded behavior. |
| Product Owner | User value, priority, acceptance criteria, scope, and product tradeoffs. |
| Business stakeholder | Outcomes, scope, priorities, risks, and decision clarity without implementation noise. |
| Business Strategy | Strategic alignment, market and financial impact, opportunity cost, and portfolio implications. |
| VP Engineering | Organizational outcomes, investment, delivery risk, staffing, and sustainable execution at scale. |
| External Customer | Usability, reliability, clarity, trust, and the real experience of consuming the product or service. |
| Reviewer or approver | Evidence, acceptance criteria, traceability, unresolved risk, and readiness. |

## Non-functional requirements: P.R.O.M.S.

- Treat non-functional requirements as product requirements: measurable early and protected from incremental degradation.
- Assess all P.R.O.M.S. categories for system-design ADRs; explain inapplicable categories. For significant code changes, assess materially affected categories. Significance means impact on performance, concurrency, recovery, integrity, security, or operations, not diff size.
- Skip routine documentation, formatting, and small changes without material non-functional impact. System-design ADRs qualify because they define behavior.
- Carry ADR criteria into plans, acceptance checks, and verification. Review affected criteria per implementation increment, even small ones; verify the full set before declaring overall completion. Significant implementations without ADRs also require this checkpoint.
- Use exactly one fresh-context SRE sub-agent at each applicable design or implementation review stage for system-design ADRs, their implementations, and significant code changes. Give it requirements, P.R.O.M.S. evidence, and the design/diff. This fulfills independent review; do not add duplicate reviewers. Reviewers never spawn reviewers. If unavailable, review directly and disclose the limitation.
- Record measurable acceptance criteria, representative operating/failure conditions, evidence or planned checks, and residual risks. Name ownership and cadence for ongoing validation. Distinguish planned checks from completed evidence.
- Provide separate targets and evidence for Reliability's Availability and Resiliency. Use P.R.O.M.S. as the critical-thinking pass's non-functional evidence; do not duplicate the narrative.

| Classification | Review focus |
| --- | --- |
| Performance | Latency, throughput, capacity, and resource efficiency under normal, peak, and degraded conditions; use representative testing to prevent regressions. |
| Reliability | Assess availability and resiliency separately. **Availability** detects failure, routes around it, and keeps the service reachable. **Resiliency** handles in-flight work, determines how processing continues or recovers, and preserves correctness. |
| Observability | Metrics, logs, traces, events, health, and readiness signals needed to detect problems, diagnose causes, verify recovery, and operate the system. |
| Maintainability | Clear ownership and contracts, low coupling, isolated change, understandable code and design, effective tests, operability, and safe evolution. |
| Security | Authentication, authorization, confidentiality, integrity, secrets, input and dependency risk, abuse cases, auditability, and applicable compliance controls. |

## Quality gates

Before presenting or recommending approval of a non-trivial plan/design or declaring any implementation, review, or comparable deliverable complete, assess:

- **Maintainability:** ownership, coupling, clarity, testability, operations, and future change cost, using available evidence and applicable P.R.O.M.S.
- **Simplicity:** identify the simplest viable option and justify added complexity.
- **Failure analysis:** identify failure, misuse, and degradation paths using relevant evidence, including applicable Reliability/Security. Prevent or mitigate avoidable failures within scope.
- **Risk decision:** state each material residual risk, recommend acceptance or rejection for each, and explain why. Continue safe investigation/mitigation; escalate unacceptable risks requiring user choice, authority, or expanded scope.

After implementation and tests, use `simplify-and-harden` on the task's diff only: remove noise, improve names/control flow, check error/security boundaries, and avoid unrelated refactors. For docs-only work, check clarity, jargon, audience, and duplication instead.

Follow [independent review stages](#independent-review-stages); use SRE when P.R.O.M.S. applies. Combine applicable stages for small changes. Do not duplicate reviewers; panels require explicit user request.

Fix in-scope Critical and Important findings before completing authorized changes. In read-only reviews, report and explicitly escalate them without editing. Rerun relevant checks after fixes; never claim success without fresh evidence.
