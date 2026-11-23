---
name: engineering-tribunal
description: Facilitate independent, risk-shaped sub-agent reviews of consequential engineering decisions, designs, contracts, and readiness claims. Use for a tribunal, review board, or multidisciplinary review; scale ordinary artifact reviews to their risks.
---

# Engineering Tribunal

Produce an evidence-backed recommendation with explicit coverage, dissent, blocker dispositions, and consumer-feedback status. Review advice is neither behavioral verification nor approval.

## Scope and authority

- Follow applicable project review and approval rules. This skill supplies defaults where rules are silent; it does not import another project's authority or authorize edits, publication, deployment, or contact with consumers.
- Distinguish **decision mode**, which compares at least two meaningful options, from **artifact mode**, which assesses an existing artifact against criteria without inventing alternatives.
- An explicitly requested tribunal or material decision uses at least three distinct independent reviewer instances. Ordinary artifact review may use one reviewer when consequence and governing policy permit. Do not turn routine edits into material choices merely to trigger a panel.
- If independent sub-agents are unavailable, offer labeled single-agent analysis and leave required tribunal coverage pending. Three personas in one context do not constitute three independent reviews.

## Facilitate the review

1. **Frame.** Record the question, mode, target, criteria, constraints, options when applicable, affected people/systems, evidence gaps, facilitator, and actual decision authority. Set a bounded completion/due signal for reviewers and a replacement or pending outcome if it is missed. Read [selection and RACI](references/selection.md).
2. **Select.** Map risks and RACI consultation needs to reviewer lenses from [perspectives](references/perspectives.md). For a tribunal cover subject expertise, affected interests or constraints, and delivery/operations/risk with three separate instances. A reviewer may combine relevant lenses but cannot occupy multiple minimum seats. Include Security for material security impact and SRE for material performance, reliability, observability, maintainability, or security operating impact; preserve all inherited mandatory reviewers. Record qualifications, independence basis, conflicts, omissions, and roster rationale.
3. **Gather consumer evidence.** Use available feedback to inform requirements before freeze. Define the next feedback checkpoint: intended consumer, task/artifact, acceptance criteria, evidence method, owner, due event, and consequences of missing feedback. Consumers provide feedback rather than automatically occupying a tribunal seat. Mandatory stakeholder reviews still apply. See [consumer checkpoint](references/selection.md#consumer-feedback-checkpoint).
4. **Freeze.** Use [packet template](assets/review-packet.md). Retain exact packet and source bytes in an authorized review location outside the target; record each source's revision/digest and the packet SHA-256 separately. Give every reviewer the same packet, relevant frozen evidence, [reviewer contract](references/reviewer-contract.md), selected lenses, and [assessment template](assets/assessment.md). Do not supply author reasoning history or same-round peer conclusions. Declared rationale and prior-round findings belong in the shared packet when relevant.
5. **Review independently.** Launch fresh, read-only sub-agents with distinct execution identities, within available concurrency limits. Each verifies evidence identity before assessment. Collect all required complete assessments before exposing peer conclusions. Handle invalid or unavailable reviewers under the shared contract; do not silently reduce coverage.
6. **Synthesize.** Use [synthesis template](assets/synthesis.md). Reconcile findings against requirements and sources, preserve individual conclusions and dissent, distinguish hard blockers from preferences, and record a disposition for each material finding. Do not count votes or average away a blocker. State the simplest viable approach, maintainability/failure concerns, and a justified accept/reject recommendation for material residual risks.
7. **Correct and bound.** Normally use one round, at most two per lifecycle. Only an authorized owner changes the target. Round two uses a new frozen packet and reviews changed passages, unresolved blockers, and resulting effects against complete context. Material change after round two starts a new decision version or review lifecycle. At the limit, expose unresolved issues and hand them to the actual authority; do not continue until favorable reviews appear.
8. **Close the checkpoint.** Report review completion separately from decision disposition, consumer validation, and implementation verification. Where required consumer evidence is missing, keep dependent readiness claims provisional or blocked. New feedback that changes meaning, constraints, or risk reopens affected review. Record human approval only when actually supplied by the competent authority; existing bounded authorization must be checked for applicability and does not arise from reviewer agreement.

## Reviewing this skill

The parent facilitator runs the workflow against a frozen copy of the skill. Reviewer sub-agents assess that target using the shared contract; they do not invoke another tribunal or spawn reviewers. Treat execution by a fresh intended agent user as consumer evidence for agent use only, not proof of human usability. Keep evaluation outputs outside the skill target.

## Deliver

Return a concise recommendation, coverage/RACI rationale, evidence revision, findings and dispositions, dissent, consumer-feedback status, residual risks, and next owner/action. Link retained records when created. Leave review, approval, execution, and feedback states individually visible.
