# Layouts and components

## Adaptive structure

Select a structure by task:

| Pattern | Suitable use | Narrow behavior |
| --- | --- | --- |
| Feed | Browsable collections | Reduce columns while preserving reading order |
| List-detail | Explore items and inspect one | Show one pane with a clear route back |
| Supporting pane | Main task with contextual information | Reposition or reveal supporting content on demand |

Adapt to available space rather than device names or user-agent detection.
Use the project's breakpoints when suitable. Retrieve Material's current
breakpoint guidance if exact M3 ranges are required; do not silently equate dp,
physical pixels, and CSS pixels. Use content fit, browser zoom, and pane width
to validate the web adaptation.

Plan navigation as part of the scaffold. Consider a navigation bar for a small
set of peer destinations in narrow views and a rail for wider views. Use labels
and current-location indicators. Keep destination identity and history stable
when presentation changes. Treat tabs as related content views, not a substitute
for arbitrary site navigation. Do not show duplicate active navigation systems
solely to fill space.

Use grids, constrained content widths, and deliberate pane proportions. Avoid
stretching short fields and buttons across desktop panes. Consider contextual
menus, dialogs, or side sheets instead of a phone-style bottom sheet on desktop.
Provide keyboard and single-pointer alternatives to gesture interactions.

## Select components by meaning

| Need | Candidate | Decision rule |
| --- | --- | --- |
| Primary action | Filled button; FAB when justified | Establish clear emphasis; use a FAB for a prominent contextual action |
| Secondary action | Tonal, outlined, or text button | Match emphasis to importance |
| Navigate | Link or navigation component | Use an anchor for a destination; preserve browser navigation behavior |
| Independent selections | Checkboxes | Make multiple-choice semantics clear |
| Exclusive selection | Radio group | Associate a group label and use one selection model |
| Immediate setting | Switch | Make the on/off consequence clear |
| Filters or compact choices | Appropriate chip variant | Distinguish input, filter, suggestion, and assist actions |
| Short contextual actions | Menu | Support keyboard movement and dismissal |
| Blocking decision | Dialog | Reserve modality for a decision that needs attention |
| Brief nonblocking feedback | Snackbar | Do not make it the sole location for critical errors |
| Work in progress | Progress indicator | Use determinate values when known; never invent completion |
| Related content | Card or list | Choose based on grouping and scan needs, not decoration |

Check the component's overview, specifications, guidelines, accessibility, and
platform availability before using unfamiliar variants. Read the selected web
library's actual API documentation before coding.

## Forms, dialogs, and data

Associate every field with a persistent label. Place help and validation near
the field and associate them programmatically. Preserve entered values when
submitting fails. Explain recovery and prevent duplicate submissions while work
is pending. Distinguish required, invalid, disabled, and read-only conditions.

Use real date and time semantics, localization, keyboard entry, and timezone
behavior appropriate to the task. Do not build a complex custom picker solely
to resemble a screenshot when an existing accessible control meets the need.

For modal dialogs, set an accessible name, place initial focus intentionally,
contain keyboard focus, support appropriate dismissal, and restore focus after
closing. Define destructive actions and cancellation clearly. Prefer vetted
dialog primitives to hand-built focus traps.

Keep tables semantic when information is tabular. Label sort controls and expose
sort state. Preserve headers and relationships at narrow widths; do not convert
rows into cards if doing so loses comparisons. Make overflow regions discoverable
and usable. Use pagination or virtualization only when the task and data justify
it, accounting for keyboard access and assistive technology.

## Expressive adoption

Treat M3 Expressive as an expansion with component-specific changes, not a global
CSS preset. Select expressive emphasis, typography, shape, and motion together.
Check each component's update date and availability separately. Do not infer web
support from Compose examples or claim that an older component library exposes
new split-button, button-group, or motion APIs.
