# Sparkline

A headless wrapper for a compact, inline data visualization. Renders a `role="img"` element with an accessible label around any visualization the consumer provides.

## What it is

A Svelte 5 headless component that renders `<span class="sparkline ...">` with `role="img"` and `aria-label`. The `children` snippet holds the actual visualization (SVG, canvas, or any custom markup).

## What it does

- Declares the visualization as a labeled image for assistive tech.
- Provides a required `aria-label` so screen readers describe the chart's meaning in place of its pixels.
- Spreads `...restProps` onto the `<span>`.

Note: the root is a `<span>` (inline), which is appropriate for inline-within-text sparklines.

## When to use it

- Tiny trend indicators inside a data table cell, a summary card, or a paragraph of text.
- Inline win/loss, up/down, or peak/trough visualizations.
- Places where a full `GraphicBlock` would be too large.

## When not to use it

- Large charts with axes, tooltips, and titles - use `GraphicBlock`.
- Interactive charts requiring keyboard input - use a richer component and `role="application"` or `role="figure"` as appropriate.
- Purely decorative imagery - `Image` with empty alt, or `aria-hidden="true"`.

## How to use it

1. Import the component.
2. Supply a translated `label` that summarizes the data ("Revenue trend over past 7 days").
3. Render SVG or canvas inside `children`.

## Props

- `class` (string, optional, default `""`) - merged with the base `sparkline` class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - visualization content.
- `...restProps` - spread onto the `<span>`.

## Usage

SVG sparkline:

```svelte
<script lang="ts">
    import Sparkline from "./Sparkline.svelte";
</script>

<Sparkline label="Revenue trend over past 7 days">
    <svg viewBox="0 0 100 20"><polyline points="0,20 20,10 40,15 60,5 80,12 100,2" fill="none" stroke="currentColor" /></svg>
</Sparkline>
```

Canvas sparkline:

```svelte
<script lang="ts">
    import Sparkline from "./Sparkline.svelte";
</script>

<Sparkline label="Temperature last 24 hours">
    <canvas width="100" height="20"></canvas>
</Sparkline>
```

Inline in a sentence:

```svelte
<script lang="ts">
    import Sparkline from "./Sparkline.svelte";
</script>

<p>Sales this week trended up <Sparkline label="Weekly sales up"><svg viewBox="0 0 60 12"><polyline points="0,12 30,8 60,0" stroke="green" fill="none" /></svg></Sparkline>.</p>
```

In a summary card:

```svelte
<script lang="ts">
    import Sparkline from "./Sparkline.svelte";
</script>

<article>
    <h3>Users</h3>
    <p>1,204</p>
    <Sparkline label="User growth last 30 days">
        <svg viewBox="0 0 120 30"><polyline points="0,28 20,22 40,14 60,16 80,10 100,7 120,2" stroke="currentColor" fill="none" /></svg>
    </Sparkline>
</article>
```

With CSS class:

```svelte
<script lang="ts">
    import Sparkline from "./Sparkline.svelte";
</script>

<Sparkline label="CPU usage" class="sparkline-compact">
    <svg viewBox="0 0 40 10"><path d="M0,8 L10,5 L20,7 L30,2 L40,4" stroke="currentColor" fill="none" /></svg>
</Sparkline>
```

## Accessibility

- `role="img"` treats the `<span>` and its descendants as a single image.
- `aria-label` replaces the visual content in the accessibility tree - it should summarize what the chart conveys, not just say "sparkline".
- Interactive sparklines need an additional pattern; this component is read-only.

References:
- WAI-ARIA `img` role: https://www.w3.org/TR/wai-aria-1.2/#img

## Related components

- `GraphicBlock` - larger framed chart with title, description, and notes.
- `Meter`, `Progress`, `ProgressCircle` - simpler scalar indicators.
- `Figure` - self-contained figure with caption.
