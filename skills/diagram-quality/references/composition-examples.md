# Composition examples

These examples illustrate judgment, not mandatory layouts or drawing syntax.
Apply them with the chosen tool and the diagram's actual technical meaning.

## Request flow and background support

For a browser calling an order service through a load balancer, make that path
the dominant reading direction. Put the database near the service that uses it.
Keep telemetry collection visibly secondary without suggesting it is optional
if it happens for every request. Background and occasional are different facts.

A telemetry sidecar can be nested within the service's enclosing group. Label
the group's meaning and distinguish the application from the sidecar. Keep an
external collector outside; nesting it for a tidier picture would change meaning.

## Labels beside arrows

For a request from Client to Server, place the request name slightly above or
below the path, nearer Client where practical. Keep enough separation to see
the uninterrupted arrow and enough proximity to identify its path.

When several routes run in parallel, reserve label space or spread the routes.
Do not cover a line with an opaque text box to conceal a collision. Move the
label, route, or nodes instead. Place an item subtitle completely within its
boundary or clearly outside it; a border must not cut through the subtitle.

## Crossings with a purpose

An intentionally tangled cross-region system can make excessive coupling
visible. Replacing every direct route with a long orthogonal detour may hide
that lesson and make tracing worse. Keep useful crossings and clear endpoints.

A crossing can also be acceptable because a direct diagonal gives the cleaner
composition. Prefer the clearer result, not a blanket prohibition. Avoid
gratuitous tangles, ambiguous shared strokes, and accidental junctions.

## Roles, state, and conditional work

Use one consistent role treatment for infrastructure, another for platform
enablers, and another for services. Include a legend mapping roles to colors.
The exact hues come from the project, not from this skill.

If a service fails, mark it red and label it Failed. If a database is unhealthy,
use amber or yellow and label the state. Preserve role identity through the
base treatment, shape, or label when state cues change its appearance.

Use a solid arrow for the main illustrated request or response that completes. A
response that arrives after the client deadline is still solid if it arrives;
the deadline alone does not prove that the connection failed. Background work
that completes in the scenario also stays solid.

Show an alternate route with a dashed arrow and label its condition. It may be
selected while every system is healthy, not only during failover. An occasional
retry can use this treatment with its actual condition, such as Retry on timeout.
Keep the route's role color: a teal alternate route can remain teal. Tune opacity
to make a rarely used path less prominent without losing readable contrast or
arrowheads. No fixed grey or opacity value is required.

Use a faded dotted stroke for a failed or interrupted connection. Keep this
distinct from a valid alternate route. Show actual solid, dashed, and dotted
arrow samples beside their meanings in the legend, rather than a prose-only key.

A paused worker or read-only database can have a dashed system box, with its
state labeled. A failed instance uses a dotted red box and a failure label. A
healthy backend that receives none of this client's traffic keeps its normal
active outline. Mere lack of traffic does not establish an inactive system.
Region or other grouping boundaries must remain distinguishable from these
system-state borders. Retain non-color cues throughout.

## Comparison and repeated work

For one connection per request versus connection reuse, keep participant
positions and phase labels consistent. In the first view, enclose the setup,
exchange, and closure that repeat. In the second, place one-time setup outside
the repeating exchange. Show closure according to the scenario's actual lifetime.

Preserve the selected protocol's phases, message directions, and concurrent
work. A neat vertical sequence must not turn independent requests into serial
requests. If version or lifecycle assumptions are unspecified, state the gap
instead of silently filling it with a familiar protocol.

## Density and presentation size

A complete architecture may need more than nine nodes. Do not delete required
components to meet an arbitrary count. For a projected presentation, use an
overview followed by readable detail views with stable positions and labels.
For an article, an enlargement option can supplement a useful overview.

Inspect the rendered result in each actual destination. Large source dimensions
and generous zoom do not establish that a caption or arrow label is readable
when embedded or projected.
