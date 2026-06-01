# FlexStack

A flex layout container for vertical or horizontal stacking with consistent gap. This headless Svelte component renders a `<div>` configured with inline `display: flex`, `flex-direction`, `gap`, and optional `align-items` and `justify-content`.

## What it is

A headless Svelte 5 component that renders a single `<div>` element. Category: layout primitives.

## What it does

- Renders a `<div>` with the base class `flex-stack` plus consumer `class`.
- Sets inline `display: flex`, `flex-direction`, and `gap` from props.
- Optionally sets `align-items` and `justify-content` when provided.
- Sets `data-direction` for consumer CSS hooks.
- Spreads `...restProps` onto the underlying `<div>`.

## When to use it

- Stacking children vertically with even spacing.
- Laying out a row of horizontal items with a consistent gap.
- Quickly aligning toolbar items, button groups, or label/control pairs.

## When not to use it

- For multi-column grids of equal widths, use `Grid`.
- For variable-height masonry layouts, use `Masonry`.
- For a top-level page skeleton, use `GrailLayout`.

## Props

- `class` — string, default `""`. CSS class appended to `flex-stack`.
- `direction` — `"row" | "column"`, default `"column"`. Flex direction.
- `gap` — string, default `"1rem"`. Gap CSS value.
- `align` — string, optional. `align-items` value.
- `justify` — string, optional. `justify-content` value.
- `children` — `Snippet`, required. Stacked content.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Vertical stack

```svelte
<script lang="ts">
  import FlexStack from './FlexStack.svelte';
</script>

<FlexStack gap="0.75rem">
  <p>One</p>
  <p>Two</p>
  <p>Three</p>
</FlexStack>
```

### Horizontal toolbar with space-between

```svelte
<FlexStack direction="row" gap="0.5rem" align="center" justify="space-between">
  <span>Left</span>
  <span>Right</span>
</FlexStack>
```

## Accessibility

- Purely structural; no ARIA role or label.
- Source order matches DOM order, preserving keyboard and screen-reader navigation.

## Related components

- `Grid` — CSS grid layout container with configurable columns.
- `Masonry` — masonry layout for variable-height items.
- `GrailLayout` — full responsive layout skeleton.

## References

- MDN flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
