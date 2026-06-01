# OverlayContainer

A full-viewport overlay backdrop for modals and sheets. This headless Svelte component renders a `<div role="presentation">` whose `hidden` attribute is toggled with the `open` prop. The overlay contributes no styling itself — consumers provide backdrop appearance, fixed positioning, and z-index. The actual modal child should declare `role="dialog"`.

## What it is

A headless Svelte 5 component that renders a single `<div>` element. Category: overlays / modals.

## What it does

- Renders a `<div>` with the base class `overlay-container` plus consumer `class`.
- Applies `role="presentation"` so the overlay does not appear in the accessibility tree.
- Sets `data-open` and `aria-hidden` based on the `open` prop.
- Adds the native `hidden` attribute when `open` is false.
- Forwards `onclick` (typical use: backdrop-close).
- Spreads `...restProps`.

## When to use it

- A backdrop behind a modal `Dialog` or `AlertDialog`.
- A backdrop behind a `Sheet` or `Drawer`.
- Any full-viewport interaction blocker.

## When not to use it

- For a non-modal popover, use `Popover` or `Popup`.
- For a tooltip, use `Tooltip`.
- For a transient toast notification, use `Toast`.

## Props

- `class` — string, default `""`. CSS class appended to `overlay-container`.
- `open` — boolean, default `false`. Whether the overlay is visible.
- `label` — string, optional. Accessible label.
- `onclick` — `(event: MouseEvent) => void`, optional. Click handler.
- `children` — `Snippet`, required. Overlay content (typically a modal element).
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import OverlayContainer from './OverlayContainer.svelte';

  let open = $state(false);
</script>

<OverlayContainer open={open} onclick={() => (open = false)} label="Modal backdrop">
  <div role="dialog" aria-modal="true" aria-label="Example dialog">
    Dialog content here
  </div>
</OverlayContainer>
```

## Accessibility

- `role="presentation"` keeps the overlay itself out of the accessibility tree.
- `aria-hidden={!open}` mirrors the visible state.
- The `hidden` attribute removes the overlay from layout when closed.
- The actual modal child must manage focus trap and Escape key handling.

## Related components

- `Dialog` — modal or non-modal dialog window.
- `AlertDialog` — modal alert dialog requiring acknowledgment.
- `Sheet` — panel sliding in from a screen edge.
- `Drawer` — panel sliding in from the side.

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- MDN `hidden` attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden
