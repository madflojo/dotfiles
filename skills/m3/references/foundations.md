# Foundations

Use the official pages in [Sources](sources.md) for exact and changing specs.
Distinguish Material guidance from the web implementation practices below.

## Tokens and color

Separate raw palette values from semantic roles and component mappings. Reuse
the project's token conventions; do not invent an incompatible parallel system.

| Role | Application |
| --- | --- |
| Primary / on-primary | High-emphasis action fill and its content |
| Primary-container / on-primary-container | Related container and its content |
| Secondary and tertiary pairs | Supporting emphasis and complementary accents |
| Error / on-error; error-container / on-error-container | Error treatment with explanatory text |
| Surface / on-surface | Background and readable foreground |
| Surface-container family | Hierarchy between grouped or nested surfaces |
| On-surface-variant | Lower-emphasis foreground, subject to contrast checks |
| Outline / outline-variant | Important boundaries / lower-emphasis dividers |

Pair foregrounds with their intended backgrounds. Do not combine arbitrary
roles because the swatches look attractive. Validate rendered contrast after
brand overrides, opacity, overlays, and state layers. Role names alone do not
guarantee sufficient contrast.

Generate or obtain a full scheme when dynamic or seed-based color is needed;
verify the chosen tool's current API. Do not fabricate palette values and call
them a generated Material scheme. Supply a usable static fallback. On the web,
do not assume access to Android wallpaper colors.

Implement dark mode by changing semantic mappings, not inverting the page.
Use system preference as a default when appropriate; retain an explicit user
choice if the product provides one. Preserve consistent roles across breakpoints.

## Typography and content

Use display, headline, title, body, and label roles with a deliberate hierarchy.
The baseline has small, medium, and large sizes per role; Expressive adds further
options. Verify exact metrics and emphasized variants before using them.

Use display text sparingly, body roles for sustained reading, and label roles for
compact controls. Match font weight, line height, and spacing together. Use
tabular numerals for changing measurements and aligned numeric columns.

Use real headings in logical order independently of visual size. Support text
resizing and long translated strings. Keep labels descriptive, action verbs
specific, and error messages actionable. Do not use placeholder text as the only
field label. Distinguish icons that convey meaning from decorative symbols.

## Shape, elevation, and icons

Assign shape by component role and hierarchy. Preserve consistent treatment
across related elements; do not turn every surface into a pill. Use expressive
shapes to direct attention without obscuring meaning or clipping focus rings.

Use elevation and tonal surfaces to communicate grouping and layering. Avoid
adding a strong shadow to every card. Retrieve exact shape and elevation values
from the chosen component specification rather than extrapolating one radius.

Use a coherent icon family such as Material Symbols when suitable. Give icon-only
controls accessible names; hide decorative icons from assistive technology.
Choose mirroring deliberately for RTL. Avoid shipping an entire icon collection
or relying on remotely loaded glyphs without considering failure and layout shift.

## Motion and states

Choose one coherent motion scheme. Current M3 motion physics distinguishes
spatial changes from effects such as opacity and color. Spatial movement may
overshoot; color and opacity should not. Verify current spring tokens and web
conversion guidance before translating Android examples into CSS.

For utilitarian flows, prefer restrained motion; reserve expressive emphasis for
meaningful actions. Honor `prefers-reduced-motion`, including JavaScript-driven
animations. Keep progress and state changes understandable without animation.

Implement applicable enabled, hover, focus, pressed, selected, dragged, disabled,
and error states. Persistent selection differs from transient press or hover.
Keep visible keyboard focus distinct and never rely on hover for essential
controls. Obtain exact state-layer colors and opacity from current component
specs; avoid applying opacity to an entire control and unintentionally dimming
its content. Disabled styling does not replace behavior enforcement.
