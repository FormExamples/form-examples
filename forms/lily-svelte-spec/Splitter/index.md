# Splitter

A headless, focusable separator between two resizable panels. Uses `role="separator"` with an orientation and a value range.

## What it is

A Svelte 5 headless primitive that renders a single empty `<div class="splitter ...">` with:

- `role="separator"`
- `aria-label`
- `aria-orientation`
- `tabindex="0"`
- default `aria-valuenow={50}`, `aria-valuemin={0}`, `aria-valuemax={100}`

## What it does

- Declares the element as a resizable separator (window splitter).
- Exposes orientation.
- Is keyboard-focusable.
- Does NOT render any children (the source renders `<div></div>`).
- Spreads `...restProps`, which can be used to override the default `aria-valuenow` with a bound value.

The consumer implements all drag handling and keyboard interaction (arrow keys to move, Home/End to snap, etc.).

## When to use it

- Between two resizable panels (three-column layouts, editor/preview splits).
- Inside IDE-style layouts and dashboards.
- Any place the user can drag a handle to resize sibling regions.

## When not to use it

- Passive horizontal rules - use `Separator`.
- Resizable containers with a corner handle - use `Resizable`.
- Scrollbar UIs - use `ScrollBar`.

## How to use it

1. Place the `Splitter` between two panels in your layout.
2. Provide a translated `label`.
3. Choose `orientation` (`"vertical"` for side-by-side panels, `"horizontal"` for stacked).
4. Bind the current position to `aria-valuenow` through restProps.
5. Implement pointer and key handlers to adjust the actual panel sizes.

## Props

- `class` (string, optional, default `""`) - merged with the base `splitter` class.
- `label` (string, required) - accessible name via `aria-label`.
- `orientation` (`"horizontal" | "vertical"`, optional, default `"vertical"`).
- `...restProps` - spread onto `<div>`; use this to override `aria-valuenow`, attach `onkeydown`, etc.

## Usage

Vertical splitter (between left and right panels):

```svelte
<script lang="ts">
    import Splitter from "./Splitter.svelte";
</script>

<div class="columns">
    <section>Left panel</section>
    <Splitter label="Resize left panel" orientation="vertical" />
    <section>Right panel</section>
</div>
```

Horizontal splitter (between top and bottom panels):

```svelte
<script lang="ts">
    import Splitter from "./Splitter.svelte";
</script>

<div class="rows">
    <section>Top</section>
    <Splitter label="Resize editor and preview" orientation="horizontal" />
    <section>Bottom</section>
</div>
```

Bound position:

```svelte
<script lang="ts">
    import Splitter from "./Splitter.svelte";
    let pos = $state(60);
</script>

<Splitter label="Resize sidebar" orientation="vertical" aria-valuenow={pos} />
```

Keyboard handler (consumer-implemented):

```svelte
<script lang="ts">
    import Splitter from "./Splitter.svelte";
    let pos = $state(50);
    function onkeydown(e: KeyboardEvent) {
        if (e.key === "ArrowLeft") pos = Math.max(0, pos - 1);
        if (e.key === "ArrowRight") pos = Math.min(100, pos + 1);
        if (e.key === "Home") pos = 0;
        if (e.key === "End") pos = 100;
    }
</script>

<Splitter label="Resize" aria-valuenow={pos} {onkeydown} />
```

Drag handler (consumer-implemented):

```svelte
<script lang="ts">
    import Splitter from "./Splitter.svelte";
    let pos = $state(50);
    function onpointerdown(e: PointerEvent) {
        const start = e.clientX;
        const startPos = pos;
        function onmove(ev: PointerEvent) {
            pos = Math.min(100, Math.max(0, startPos + ev.clientX - start));
        }
        function onup() {
            window.removeEventListener("pointermove", onmove);
            window.removeEventListener("pointerup", onup);
        }
        window.addEventListener("pointermove", onmove);
        window.addEventListener("pointerup", onup);
    }
</script>

<Splitter label="Resize" aria-valuenow={pos} {onpointerdown} />
```

## Accessibility

- `role="separator"` with `aria-orientation` is the correct pattern for a window splitter.
- `aria-valuenow`/`aria-valuemin`/`aria-valuemax` communicate split position to assistive tech.
- `tabindex="0"` makes the splitter keyboard-focusable.
- Consumers must provide a visible focus indicator and implement arrow-key resize.

References:
- WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator

## Related components

- `Resizable` - a single resizable region (not between panels).
- `Separator` - passive horizontal rule.
- `ScrollBar` - custom scrollbar track.
