# Sources and freshness

Research snapshot: November 22, 2026. This is an original, selective synthesis
for web tasks, not an exhaustive crawl or an official Google skill. Attribute
Material Design to Google. Follow upstream licenses for any copied assets or
code; this skill bundles neither site imagery nor upstream implementation code.

## Primary references

| Source | Use |
| --- | --- |
| [Material 3](https://m3.material.io/) | Current announcements and entry points |
| [Get started](https://m3.material.io/get-started) | M3 and Expressive scope; design versus development resources |
| [Foundations](https://m3.material.io/foundations/) | Locate accessibility, tokens, layout, interaction, and content guidance |
| [Color roles](https://m3.material.io/styles/color/the-color-system) | Semantic pairs and surface hierarchy |
| [Applying type](https://m3.material.io/styles/typography/applying-type) | Type roles, readability, and contrast |
| [Canonical layouts](https://m3.material.io/foundations/layout/canonical-examples/overview) | Feed, list-detail, and supporting panes |
| [Desktop components](https://m3.material.io/foundations/desktop/components) | Navigation and desktop adaptations |
| [Motion physics](https://m3.material.io/styles/motion/overview/how-it-works) | Motion schemes, springs, and platform translation |
| [Components](https://m3.material.io/components) | Discover current component pages and availability |
| [Date pickers](https://m3.material.io/components/date-pickers/) | Example of variants and input considerations |
| [Time pickers](https://m3.material.io/components/time-pickers/) | Example of evolving Expressive guidance |
| [Material Web](https://github.com/material-components/material-web) | Actual web implementation, documentation, and maintenance notice |
| [Material Web roadmap](https://github.com/material-components/material-web/blob/main/docs/roadmap.md) | Coverage gaps and development status |

## Resolve changing details

Open the relevant component page and its implementation docs before prescribing
exact APIs or dimensions. Follow current navigation rather than guessing a URL.
Some older Material URLs return 404, and basic fetches can return only a
JavaScript-required shell. Use a rendered browser or indexed official content
when available; do not treat that shell as reviewed documentation.

Check component version, update date, platform availability, and the installed
package version separately. If guidance conflicts, distinguish the current
design recommendation from what the installed implementation supports. State
the limitation and choose a compatible fallback. Recheck library maintenance
and Expressive coverage before dependency recommendations.
