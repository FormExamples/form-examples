# ScrollBar

A headless scrollbar element with the ARIA `scrollbar` role, orientation, and value range. Designed for custom scrollbar UIs where the consumer draws the thumb and implements the drag logic.

## What it is

`ScrollBar` renders a single `<div class="scroll-bar ...">` with `role="scrollbar"`, `aria-orientation`, `aria-label`, and initial `aria-valuenow=0 / aria-valuemin=0 / aria-valuemax=100`. The visual thumb is supplied by the consumer via the `children` snippet.

## What it does

- Declares a scrollbar track for assistive technologies.
- Exposes orientation (`horizontal` or `vertical`) through `aria-orientation`.
- Sets default ARIA value attributes that the consumer can override via `restProps` (for example, `aria-valuenow={pos}`).
- Renders the supplied `children` (typically the draggable thumb).

Drag logic, scroll synchronization, and keyboard handling are the consumer's responsibility.

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
4. Override `aria-valuenow` (and optionally `aria-valuemin`/`aria-valuemax`) through restProps to reflect the current scroll position.
5. Put the draggable thumb in the `children` snippet and implement pointer/keyboard handling yourself.

## Props

- `class` (string, optional, default `""`) - merged with the base `scroll-bar` class.
- `label` (string, required) - accessible name via `aria-label`.
- `orientation` (`"vertical" | "horizontal"`, optional, default `"vertical"`) - written to `aria-orientation`.
- `children` (Snippet, required) - scrollbar content (typically the thumb).
- `...restProps` - any additional attributes spread onto the `<div>`, including overrides for `aria-valuenow`/`aria-valuemin`/`aria-valuemax`.

## Usage

Vertical scrollbar with a simple thumb:

```svelte
<script lang="ts">
    import ScrollBar from "./ScrollBar.svelte";
</script>

<ScrollBar orientation="vertical" label="Page scroll">
    <div class="thumb"></div>
</ScrollBar>
```

Horizontal timeline scrollbar:

```svelte
<script lang="ts">
    import ScrollBar from "./ScrollBar.svelte";
</script>

<ScrollBar orientation="horizontal" label="Timeline scroll">
    <div class="thumb"></div>
</ScrollBar>
```

Reflecting a bound scroll position:

```svelte
<script lang="ts">
    import ScrollBar from "./ScrollBar.svelte";
    let pos = $state(42);
</script>

<ScrollBar orientation="vertical" label="List scroll" aria-valuenow={pos}>
    <div class="thumb" style={`top:${pos}%`}></div>
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
    <ScrollBar orientation="vertical" label="Content scroll">
        <div class="thumb"></div>
    </ScrollBar>
</div>
```

## Accessibility

- `role="scrollbar"` is the correct role for a scroll control.
- `aria-orientation` announces the axis.
- Consumers MUST keep `aria-valuenow` in sync with the actual scroll position for screen-reader parity.
- Keyboard support (Arrow / Page / Home / End) must be implemented by the consumer.

References:
- WAI-ARIA `scrollbar` role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar

## Related components

- `ScrollArea` - the scrollable content region this scrollbar typically accompanies.
- `Slider` - numeric value selection via range input.
- `Splitter` - draggable separator.
- `Resizable` - focusable resize region.

---

Lily™ and Lily Design System™ are trademarks.
