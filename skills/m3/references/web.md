# Web implementation and verification

## Choose a practical path

1. Inspect package versions, framework, SSR/hydration requirements, existing
   primitives, browser targets, CSP, and asset-loading conventions.
2. Prefer the existing compatible component system. Separate its name from its
   actual M3 conformance. For Angular, inspect the installed Angular Material
   theming API. For React, Vue, or Svelte, confirm the chosen library's current
   support rather than assuming a Material label means M3.
3. For `@material/web`, inspect the official README, roadmap, and installed
   component exports. As checked on November 22, 2026, the project reports
   maintenance mode. Recheck before recommending it for new work. It does not
   provide every component in the Material design catalogue.
4. If coverage is inadequate, style existing accessible primitives or semantic
   HTML through M3 tokens. Explain meaningful fidelity tradeoffs. Do not invent
   imports or add a new component framework for a few styles.

## Connect tokens to code

Use the project's established theme mechanism. Where plain CSS is appropriate,
map system roles to custom properties and consume those properties in custom
components. For example, the following maps roles; it intentionally omits palette
values and is not a complete theme:

```css
.primary-action {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.content-panel {
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
}
```

Define every consumed variable in an actual theme or provide a deliberate
fallback. Distinguish system tokens from component-specific tokens and local
aliases. Verify exact token spellings for the target library. Document custom
aliases so they are not mistaken for official Material tokens.

For Web Components, account for custom events, form association, framework
bindings, and Shadow DOM theming boundaries. Check server rendering and
hydration instead of assuming parity with native controls. Import only needed
components, pin dependencies through project conventions, and avoid production
examples that depend on unversioned CDN imports.

## Verify behavior and accessibility

Use the repository's tests and available browser tooling. Run checks against
the final change; do not describe planned checks as completed.

- Inspect representative narrow and wide viewports and intermediate widths near
  layout transitions. Check long labels, empty content, and dense data.
- Exercise navigation, forms, errors, selection, submission, and async states.
  Confirm controls work beyond visual click feedback.
- Navigate entirely by keyboard. Check logical focus order, visible focus,
  dialog containment/restoration, Escape handling, and absence of keyboard traps.
- Check semantic names, landmarks, headings, labels, error associations, and
  announcements. Use automated tooling where available plus manual inspection;
  an automated pass does not establish screen-reader compatibility.
- Measure contrast in actual light/dark and state combinations. Target at least
  4.5:1 for normal text and 3:1 for qualifying large text; check applicable
  non-text UI contrast separately. Follow the project's accessibility standard.
- Use a practical touch-friendly target such as 48 CSS px where suitable; label
  this as a web design choice, not a universal WCAG minimum or a literal dp
  conversion. Verify density choices against input types and spacing.
- Test text resize, 200% zoom, narrow reflow, reduced motion, and forced colors
  where supported. Do not disable browser zoom. Use logical CSS properties and
  test RTL where required.
- Inspect font/icon loading failures, focus clipping, overlays, and page shifts.
  Test accessible alternatives for dragging, swiping, or hover-only controls.

For a review without a runnable app, inspect source and supplied images, identify
what each supports, and explicitly list unverified behavior. Do not infer focus
handling, screen-reader behavior, or contrast compliance from a screenshot.
