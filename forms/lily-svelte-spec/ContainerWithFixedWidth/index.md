# ContainerWithFixedWidth

A centered content wrapper with a fixed max-width breakpoint. This headless Svelte component renders a `<div>` with inline `max-width` and `margin-inline: auto` so the container naturally centers within its parent — handy as a top-level page wrapper or article body wrapper.

## What it is

A headless Svelte 5 component that renders a single `<div>` element. Category: layout primitives.

## What it does

- Renders a `<div>` with class `container-with-fixed-width` plus consumer `class`.
- Sets inline `max-width: {maxWidth}` and `margin-inline: auto` for centering.
- Sets `data-max-width` for consumer CSS hooks (e.g., breakpoint queries).
- Spreads `...restProps` onto the underlying `<div>`.

## When to use it

- Wrapping page content to keep it readable on wide displays.
- Constraining article body width to a comfortable measure.
- Centering a card or feature block within a wider parent.

## When not to use it

- For full-bleed sections, use `ContainerWithFluidWidth`.
- For maintaining an aspect ratio, use `AspectRatioContainer`.
- For multi-column layouts, use `Grid` or `FlexStack`.

## How to use it

Import `ContainerWithFixedWidth` and pass `maxWidth`. Required prop: `children`.

## Props

- `class` — string, default `""`. CSS class appended to `container-with-fixed-width`.
- `maxWidth` — string, default `"1200px"`. Max width CSS value (any valid CSS length, e.g., `80ch`, `64rem`).
- `children` — `Snippet`, required. Content.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import ContainerWithFixedWidth from './ContainerWithFixedWidth.svelte';
</script>

<ContainerWithFixedWidth maxWidth="960px">
  <article>Article content here.</article>
</ContainerWithFixedWidth>
```

## Accessibility

- Purely structural; no ARIA role or label.
- Does not interfere with focus order or screen reader navigation.

## Related components

- `ContainerWithFluidWidth` — full-width wrapper with horizontal padding.
- `AspectRatioContainer` — fixed aspect ratio container.
- `ArticleLayout` — top-level article wrapper with column widths.

## References

- MDN `max-width`: https://developer.mozilla.org/en-US/docs/Web/CSS/max-width
- MDN `margin-inline`: https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline
