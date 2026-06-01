# Grid

A CSS grid layout container with configurable columns and gap. This headless Svelte component renders a `<div>` with inline `display: grid` and a `grid-template-columns` value computed from a number (equal columns) or a custom CSS string.

## What it is

A headless Svelte 5 component that renders a single `<div>` element. Category: layout primitives.

## What it does

- Renders a `<div>` with the base class `grid` plus consumer `class`.
- When `columns` is a number, sets `grid-template-columns: repeat({columns}, minmax(0, 1fr))`.
- When `columns` is a string, uses it verbatim as `grid-template-columns`.
- Sets inline `display: grid` and `gap`.
- Sets `data-columns` for consumer CSS hooks.
- Spreads `...restProps` onto the underlying `<div>`.

## When to use it

- Equal-width column layouts (e.g., a 12-column system).
- Bespoke layouts with custom track sizes (e.g., `200px 1fr 200px`).
- Card galleries with consistent gutters.

## When not to use it

- For one-axis stacking, use `FlexStack`.
- For variable-height items in newspaper-style columns, use `Masonry`.
- For top-level page skeletons, use `GrailLayout`.

## Props

- `class` — string, default `""`. CSS class appended to `grid`.
- `columns` — number | string, default `12`. Number of equal columns or a `grid-template-columns` value.
- `gap` — string, default `"1rem"`. Gap CSS value.
- `children` — `Snippet`, required. Grid items.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Equal 3-column grid

```svelte
<script lang="ts">
  import Grid from './Grid.svelte';
</script>

<Grid columns={3} gap="1rem">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
</Grid>
```

### Custom track sizes

```svelte
<Grid columns="200px 1fr 200px" gap="1.5rem">
  <aside>Nav</aside>
  <main>Content</main>
  <aside>Meta</aside>
</Grid>
```

## Accessibility

- Purely structural; no ARIA role or label.
- Note that visual order driven by `grid-template-areas` may diverge from DOM order; keep DOM order in sync with reading order for accessibility.

## Related components

- `FlexStack` — flex layout for single-axis stacking.
- `Masonry` — masonry layout for variable-height items.
- `GrailLayout` — full responsive layout skeleton.

## References

- MDN CSS Grid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
