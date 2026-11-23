# Selection, RACI, and consumer feedback

## Use RACI to find affected interests

RACI identifies who is Responsible for preparing/applying work, Accountable for its decision, Consulted for expertise or affected interests, and Informed of its outcome. Record actual people, teams, or established authorities where known; leave unknown assignments explicit. A reviewer persona is not a real organizational owner.

Start with the decision and risks, map affected owners, then choose reviewers who can assess the relevant consultation concerns. An Informed party may still reveal an important downstream impact. RACI is a selection aid, not a vote, quorum, or delegation of authority. A named A must have applicable authority; their assent cannot waive another authority's hard constraint. If ownership is divided, split the decision or identify the separate decisions and approvals.

## Illustrative RACI

Replace these example roles with the project's actual owners. The C column suggests lenses; it does not require every listed lens in every review.

| Work or decision | Responsible | Accountable | Consulted | Informed |
| --- | --- | --- | --- | --- |
| Product scope | Product team | Product decision owner | Product Strategy, Business Architecture, Engineering, affected user representatives | Delivery and support teams |
| Architecture or dependency | Technical lead | Established architecture owner | Solution Architecture, Engineering, affected system owners, SRE, Security | Implementing teams |
| API contract | API team | API contract owner | API Design, Engineering, Security, Testing, integrators | Support and client teams |
| User flow and language | Design/product team | Experience or product owner | UI/UX Design, Copywriting, Engineering, accessibility expertise, intended users | Support and delivery teams |
| Migration or recovery | Owning engineering team | Data/service authority | Engineering, SRE, Security, affected application/data owners, Testing | Operators and support |
| Readiness claim | Delivery owner | Applicable release authority | Engineering, Testing, SRE, required Security and audience evidence owners | Affected teams |
| Standard or reusable skill | Maintainer | Established policy/artifact owner | Engineering, Governance, Team Lead, intended users | Adopting teams |

## Turn consultation needs into a roster

For a full tribunal, allocate three distinct execution instances:

| Coverage seat | Selection question | Example lenses |
| --- | --- | --- |
| Subject expertise | Who can challenge the core technical or design choice? | Solution Architecture, Engineering, API Design, UI/UX Design |
| Affected interests or constraints | Who can challenge consequences beyond the authoring team? | Business Architecture, Product Strategy, Copywriting, Security, cross-system Engineering |
| Delivery, operations, or risk | Who can challenge execution, verification, and sustained use? | Team Lead, Testing, SRE, Governance |

Map every material risk and mandatory consultation to at least one qualified reviewer. Combine lenses only where context and expertise support them. Add a seat when required coverage remains unmet; never count one execution twice. Missing mandatory human/stakeholder review remains missing even if an agent covers the related analytical lens.

Examples:

- Distributed-service design: Solution Architecture; Engineering focused on affected service contracts; SRE. Add Security when security impact needs expertise those reviewers do not provide.
- API onboarding flow: API Design; UI/UX Design with Copywriting if qualified; Testing or Engineering focused on integration failures. Add Security for material authorization/data risk and SRE for material operating impact.
- New agent skill: Engineering/skill design; Team Lead focused on adopting teams and handoffs; Governance focused on authority, evidence, and failure handling. Separately run the consumer checkpoint with a fresh intended agent user.
- Typo correction: use a bounded clarity review if required; no full tribunal unless explicitly requested or a material meaning change is discovered.

## Consumer feedback checkpoint

Treat consumers as evidence providers at a defined checkpoint, not automatic board members. Consumers can still hold decision authority or require consultation under the project's rules.

Before freeze, incorporate available feedback and mark unsupported audience assumptions. After the initial expert recommendation, obtain targeted feedback before making a claim whose acceptance depends on it. For high-risk assumptions, obtain feedback earlier rather than waiting for a finished design.

Record:

- Intended consumer population and representative task, including accessibility or integration needs.
- Artifact/revision evaluated, method, acceptance criteria, participant or execution identity, and observations.
- Checkpoint owner, due event, feedback status (planned, collected, missing, or not required with rationale), and the claims it supports.
- Changes, follow-up, and the effect of absent or adverse feedback on readiness.

Examples: observe intended users completing a prototype task; have an integrator exercise API error/retry examples; ask an operator to walk recovery; have a fresh agent execute a skill against a controlled fixture.

Do not contact people, transmit artifacts, or operate live systems without applicable authorization. When access is unavailable, report the missing evidence and proceed only with independent work. Simulated human reactions are hypotheses. Actual agent execution is feedback for agent consumers only. Material feedback changes reopen affected review and evidence; a revised recommendation is not automatically covered by an old approval.
