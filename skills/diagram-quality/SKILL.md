---
name: diagram-quality
description: >-
  Create, improve, or review explanatory diagrams for clear request paths,
  meaningful grouping, readable labels, consistent visual semantics, and
  technical accuracy. Use for system, architecture, flow, sequence, and state
  diagrams in articles, documentation, and presentations, regardless of the
  drawing tool or output format.
license: Apache-2.0
---

# Diagram Quality

Make the intended relationship, mechanism, or tradeoff easy to see while
preserving its meaning. Keep diagrams simple and technically accurate.
Apply these principles with the user's chosen tools, format, and visual style.
Do not require a renderer, font, palette, grid size, or fixed node count.

## Establish the explanation

- Identify the audience, destination, and question the diagram answers. Inspect
  the surrounding explanation and existing diagrams before changing them.
- For a review, report findings without editing. For creation or revision,
  preserve the requested scope and editable source conventions.
- Choose the form by the question: sequence for order and concurrency, topology
  for connections, containment for membership, state transitions for lifecycle.
  Use a table or prose when that communicates the point more clearly.
- Preserve direction, ownership, concurrency, repeated work, active states,
  conditions, and uncertainty. Flag missing facts instead of inventing behavior.

## Follow the initiating path

- Arrange the main flow around the initiating action or request path as much as
  possible. Make its start, progression, and outcome easy to follow.
- Separate supporting activity from the main path with placement, boundaries,
  and consistent role colors. Background work must not compete with the focus.
- In request-path diagrams, arrows follow requests, not the mere existence or
  opening direction of a connection. Show responses separately when relevant.
  For other diagram types, define the actual relationship the arrow represents;
  do not turn dependencies, replication, or state transitions into requests.
- State the arrow convention when ambiguous. Do not imply serial execution,
  synchronous behavior, or a single winner through layout unless that is true.

## Organize with meaningful boundaries

- Use proximity and boundaries to organize, simplify, and show relationships.
  Label what each enclosure means: region, process, ownership, repeated work,
  or a logical group. Do not imply physical containment from grouping alone.
- Nest only where the relationship is true. A sidecar can sit inside its
  service's enclosing box; keep separate runtime components distinguishable.
- Align peers and give comparable elements consistent sizes and spacing where
  practical. Reserve room for boundary headings and routes before adding detail.
- Across comparisons or successive views, retain component positions, names,
  scale, and visual meanings where possible. Emphasize the actual change.
- Frame exactly the steps that repeat. Keep one-time setup outside that frame.

## Keep paths and labels readable

- Prefer direct, economical routes, straight or orthogonal as appropriate.
  Avoid messy crossings, overlapping streams, and paths through unrelated items.
  Crossings are acceptable when they explain complexity or make the composition
  clearer or better looking. Keep their endpoints traceable and distinguish
  crossings from junctions; diagonals are not inherently defects.
- End arrows at their actual targets. Keep independent paths distinct; use a
  shared trunk only when it represents a shared relationship.
- Place arrow labels slightly above, below, or beside the line, preferably
  nearer the source than destination. Keep their association obvious without
  hiding, masking, or breaking the arrow. Do not place text across its stroke.
- Put an item's text fully inside it or clearly outside beside it, never
  straddling its boundary. Leave visible padding and fit the text deliberately.
- Use concise, specific labels. Reorganize, wrap sensibly, enlarge the available
  space, or split the view before shrinking essential labels excessively.
- Use whitespace deliberately. Center a compact standalone diagram when
  appropriate; align related views consistently rather than filling every gap.

## Give visual treatments consistent meanings

- Map colors to roles consistently, for example infrastructure, platform
  enablers such as load balancers and databases, and services. Choose actual
  colors to suit the project; role colors need not be limited to two elements.
- Include a legend for meaningful colors and explain non-obvious line styles
  or symbols. Pair color with labels or other cues; color alone is insufficient.
- Show failed elements in red and unhealthy elements in amber or yellow, with
  explicit state labels. Reserve those state cues so role colors do not imply
  failure. Use an outline, badge, or similar treatment to retain role identity.
- Show actions that happen sometimes with dashed, slightly faded paths. State
  the condition, retain readable contrast, and explain the convention. Keep
  occasional behavior distinguishable from inactive, bypassed, or failed paths.
  Do not silently redefine established notation in an existing diagram.
- Use icons when they improve recognition or explanation. Not every item needs
  one. Emojis add a playful, less serious tone; use them sparingly when suitable.
- Make the main path prominent through placement, line weight, and restrained
  emphasis, even when several role colors are present. Avoid decoration that
  competes with the explanation.

## Simplify without changing the story

- Remove incidental detail, not facts necessary to understand the mechanism.
  Preserve meaningful protocol phases, failure conditions, and ownership.
- Split dense material into overview/detail or a sequence of stable views when
  necessary. Mark omissions that could otherwise imply a complete deployment.
- Keep necessary meaning available in static output. Add a text equivalent
  suited to the destination: numbered steps for sequences, bullets for structure
  or comparisons. Describe important direction, boundaries, and outcomes.
- Enlargement can support detailed article diagrams; it cannot rescue a
  projected slide. Keep the overview useful and provide detail in a readable
  form. Never accept tiny text merely because the diagram fits without overflow.

## Render, inspect, and refine

Inspect the actual output at its intended size and in context: article width,
phone width, projected-slide proportions, or print size as applicable. Inspect
each required export for clipping, distortion, label collisions, arrowheads,
contrast, font substitution, and lost detail. Use available rendering tools;
source parsing or a successful build does not prove visual quality. If rendering
is unavailable, report the limit and leave visual verification unresolved.

Before delivery, check:

1. Can the reader identify the main point and initiating path quickly?
2. Can they trace important relationships without guessing at labels or arrows?
3. Do grouping, color, state, and line conventions carry consistent meanings?
4. Does simplification preserve technical meaning, including exceptional paths?
5. Is essential content readable in its actual destination and static exports?

Fix material issues and inspect again. Report remaining limitations and any
deliberate exceptions briefly, scaled to the request. Keep review-only output
focused on concrete findings, their effects, and suggested corrections.

For difficult tradeoffs or concrete examples of these principles, read
[Composition examples](references/composition-examples.md).
