# ContextualHelp

A help button that opens a popover with explanatory content.

## What it is

A headless Svelte 5 component that renders a wrapper `<div class="contextual-help">` containing a `<button class="contextual-help-trigger">` and a `<div role="dialog" class="contextual-help-panel">`. The panel id is auto-generated and wired to the trigger via `aria-controls`.

## What it does

- Trigger button has `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`.
- Panel has `role="dialog"` and a stable id; it is `hidden` when `expanded` is false.
- Generates a stable id with `crypto.randomUUID()` (Math.random fallback).

## When to use it

- Inline help anchored to a form field, label, or icon.
- Click-to-reveal explanations next to controls.

## When not to use it

- For automatic spotlighting, use `Coachmark`.
- For modal interactions that require acknowledgement, use `AlertDialog`.
- For very short hover/focus hints, use `Tooltip`.

## Props

- `class` — string, default `""`.
- `label` — string, **required**. `aria-label` for the trigger.
- `expanded` — boolean, default `false`.
- `onclick` — `(event: MouseEvent) => void`, optional. Trigger click handler.
- `children` — `Snippet`, optional. Popover content.

## Usage

```svelte
<script lang="ts">
  import ContextualHelp from './ContextualHelp.svelte';

  let open = $state(false);
</script>

<ContextualHelp label="Help with this field" expanded={open} onclick={() => (open = !open)}>
  <p>Why we ask: this helps verify your account.</p>
</ContextualHelp>
```

## Accessibility

- Trigger has `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`.
- Panel has `role="dialog"` and a stable id; the native `hidden` attribute removes it from the accessibility tree when collapsed.
- Consumer is responsible for focus management when the dialog opens.

## Related components

- `Coachmark` — anchored popover that spotlights a feature.
- `Tooltip` — short hover/focus hint.
- `AlertDialog` — modal acknowledgement dialog.

## References

- Adobe Spectrum ContextualHelp: https://spectrum.adobe.com/page/contextual-help/
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
