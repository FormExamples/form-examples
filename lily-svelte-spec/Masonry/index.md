# Masonry

A masonry layout container for variable-height items, implemented via the CSS multi-column approach. This headless Svelte component renders a `<div>` with inline `column-count` and `column-gap`. Children should set `break-inside: avoid` via consumer CSS so items are not split across columns.

## What it is

A headless Svelte 5 component that renders a single `<div>` element. Category: layout primitives.

## What it does

- Renders a `<div>` with the base class `masonry` plus consumer `class`.
- Sets inline `column-count: {columns}` and `column-gap: {gap}`.
- Sets `data-columns` for consumer CSS hooks.
- Spreads `...restProps`.

## When to use it

- Photo galleries with mixed aspect ratios.
- Pinterest-style note or card boards.
- Newspaper-like text columns of varying lengths.

## When not to use it

- For equal-width columns of equal-height children, use `Grid`.
- For one-axis stacking, use `FlexStack`.
- For horizontally scrollable items, use `HorizontalScroller`.

## Props

- `class` — string, default `""`. CSS class appended to `masonry`.
- `columns` — number, default `3`. Column count.
- `gap` — string, default `"1rem"`. Column gap CSS value.
- `children` — `Snippet`, required. Masonry items.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import Masonry from './Masonry.svelte';
</script>

<Masonry columns={3} gap="1rem">
  <article>Short</article>
  <article>Tall content here, much longer than the others.</article>
  <article>Medium length</article>
</Masonry>
```

### Consumer CSS for child items

```css
.masonry > * {
  break-inside: avoid;
  margin-block-end: 1rem; /* multi-column doesn't honor row-gap */
}
```

## Accessibility

- Purely structural; no ARIA role or label.
- Reading order matches DOM order (top to bottom in each column, left to right).

## Related components

- `Grid` — CSS grid for equal-width columns.
- `FlexStack` — single-axis flex stacking.
- `HorizontalScroller` — horizontally scrollable container.

## References

- MDN multi-column layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_multicol_layout
- MDN `break-inside`: https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside
