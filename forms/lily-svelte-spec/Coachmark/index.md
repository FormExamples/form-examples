# Coachmark

An anchored popover that spotlights and explains a single feature.

## What it is

A headless Svelte 5 component that renders a `<div role="dialog" aria-modal="false">` with an internal heading, optional description, and a required dismiss button. Stable ids for `aria-labelledby` / `aria-describedby` are auto-generated using `crypto.randomUUID()` (with a `Math.random` fallback).

## What it does

- Renders the dialog hidden via the native `hidden` attribute when `open` is false.
- Renders an `<h2 class="coachmark-title">` and optional `<p class="coachmark-description">`.
- Renders a `<button class="coachmark-dismiss">` whose `aria-label` is the required `dismissLabel`.
- Wires `aria-labelledby` to the heading's id and `aria-describedby` to the description's id (when provided).

## When to use it

- Spotlighting a single new feature for first-time users.
- Brief inline help anchored to a UI element.

## When not to use it

- For a click-to-open help button, use `ContextualHelp`.
- For a modal interaction that requires acknowledgement, use `AlertDialog`.
- For toast-style transient messages, use `Toast`.

## Props

- `class` — string, default `""`.
- `open` — boolean, default `false`.
- `title` — string, **required**. Heading.
- `description` — string, optional. Body text.
- `dismissLabel` — string, **required**. `aria-label` for the dismiss button.
- `onDismiss` — `() => void`, optional.

## Usage

```svelte
<script lang="ts">
  import Coachmark from './Coachmark.svelte';

  let open = $state(true);
</script>

<Coachmark
  {open}
  title="New dashboard"
  description="See your activity at a glance."
  dismissLabel="Dismiss"
  onDismiss={() => (open = false)}
/>
```

## Accessibility

- `role="dialog"` with `aria-modal="false"` (non-modal popover dialog).
- `aria-labelledby` always points at the heading.
- `aria-describedby` is set only when a description is provided.
- The native `hidden` attribute removes the closed coachmark from the accessibility tree.

## Related components

- `ContextualHelp` — click-to-open help popover with consumer-supplied content.
- `AlertDialog` — modal acknowledgement dialog.
- `Tooltip` — small hover-or-focus tooltip.

## References

- Adobe Spectrum Coachmark: https://spectrum.adobe.com/page/coach-mark/
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
