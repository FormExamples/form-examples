# ScrollBar

A headless scrollbar element with the ARIA `scrollbar` role, orientation, a bindable value, and its keyboard. Designed for custom scrollbar UIs where the consumer draws the thumb and implements the drag logic.

## What it is

`ScrollBar` renders a single focusable `<div class="scroll-bar ...">` with `role="scrollbar"`, `aria-orientation`, `aria-label`, `aria-controls`, and `aria-valuenow` / `aria-valuemin` / `aria-valuemax` from `value`, `min` and `max`. The visual thumb is supplied by the consumer via the `children` snippet.

## What it does

- Declares a scrollbar track for assistive technologies.
- Exposes orientation (`horizontal` or `vertical`) through `aria-orientation`.
- Reflects the bindable `value` in `aria-valuenow`, within `min`..`max`.
- Moves `value` on the keys: Arrow Up/Left and Arrow Down/Right by `step`, Page Up/Page Down by `pageStep`, Home/End to `min`/`max`, clamped.
- Renders the supplied `children` (typically the draggable thumb).

Drag logic and scroll synchronization (scrolling the content to `value`, and writing `value` back as the content scrolls) are the consumer's responsibility.

## When to use it

- Custom scrollbar UI paired with a `ScrollArea` or any scrollable content region.
- Timeline scrubbers, horizontal carousel bars, or other controls that are semantically scrollbars.
- Places where native browser scrollbars are hidden and replaced with a custom control.

## When not to use it

- Standard page or container scrolling - the browser already exposes native scrollbars.
- A draggable separator between two panels - use `Splitter` with `role="separator"` instead.
- A slider for picking a numeric value - use `Slider`.

## How to use it

1. Import from its source file.
2. Pass a translated `label`.
3. Choose `orientation` (`"vertical"` or `"horizontal"`).
4. `bind:value` to the scroll position, set `min`, `max`, `step` and `pageStep` to the content's scale, and `controls` to the scrolled element's id.
5. Put the draggable thumb in the `children` snippet and implement pointer handling yourself.

## Props

- `class` (string, optional, default `""`) - merged with the base `scroll-bar` class.
- `label` (string, required) - accessible name via `aria-label`.
- `orientation` (`"vertical" | "horizontal"`, optional, default `"vertical"`) - written to `aria-orientation`.
- `value` (number, bindable, default `0`) - the scroll position, written to `aria-valuenow`.
- `min` (number, default `0`) and `max` (number, default `100`) - the range, written to `aria-valuemin` / `aria-valuemax`.
- `step` (number, default `1`) - the arrow-key increment.
- `pageStep` (number, default `10`) - the Page Up / Page Down increment.
- `controls` (string, optional) - the scrolled element's id, written to `aria-controls`.
- `children` (Snippet, required) - scrollbar content (typically the thumb).
- `...restProps` - any additional attributes spread onto the `<div>`.

## Usage

Vertical scrollbar with a simple thumb:

```svelte
<script lang="ts">
  import ScrollBar from "./ScrollBar.svelte";
</script>

<ScrollBar
  orientation="vertical"
  label="Page scroll"
>
  <div class="thumb"></div>
</ScrollBar>
```

Horizontal timeline scrollbar:

```svelte
<script lang="ts">
  import ScrollBar from "./ScrollBar.svelte";
</script>

<ScrollBar
  orientation="horizontal"
  label="Timeline scroll"
>
  <div class="thumb"></div>
</ScrollBar>
```

Reflecting a bound scroll position:

```svelte
<script lang="ts">
  import ScrollBar from "./ScrollBar.svelte";
  let pos = $state(42);
</script>

<ScrollBar
  orientation="vertical"
  label="List scroll"
  bind:value={pos}
>
  <div
    class="thumb"
    style={`top:${pos}%`}
  ></div>
</ScrollBar>
```

Paired with a scroll area:

```svelte
<script lang="ts">
  import ScrollArea from "../ScrollArea/ScrollArea.svelte";
  import ScrollBar from "./ScrollBar.svelte";
</script>

<div class="scroll-layout">
  <ScrollArea label="Content">...</ScrollArea>
  <ScrollBar
    orientation="vertical"
    label="Content scroll"
  >
    <div class="thumb"></div>
  </ScrollBar>
</div>
```

## Accessibility

- `role="scrollbar"` is the correct role for a scroll control.
- `aria-orientation` announces the axis.
- Consumers MUST keep `value` in sync with the actual scroll position for screen-reader parity.
- The keys (Arrow / Page / Home / End) move `value`; the consumer scrolls the content to it.

References:

- WAI-ARIA `scrollbar` role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar

## Related components

- `ScrollArea` - the scrollable content region this scrollbar typically accompanies.
- `Slider` - numeric value selection via range input.
- `Splitter` - draggable separator.
- `Resizable` - focusable resize region.

---

Lily™ and Lily Design System™ are trademarks.
