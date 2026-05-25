# ContainerWithFluidWidth

A full-width content wrapper with horizontal padding. This headless Svelte component renders a `<div>` that spans 100% of its parent and applies a configurable `padding-inline` so content does not touch viewport edges on small screens.

## What it is

A headless Svelte 5 component that renders a single `<div>` element. Category: layout primitives.

## What it does

- Renders a `<div>` with class `container-with-fluid-width` plus consumer `class`.
- Sets inline `width: 100%` and `padding-inline: {paddingInline}`.
- Sets `data-padding-inline` for consumer CSS hooks.
- Spreads `...restProps` onto the underlying `<div>`.

## When to use it

- Wrapping full-bleed page sections that need consistent gutters.
- Hero or banner backgrounds that go edge-to-edge but pad inner content.
- Pages without a fixed maximum width.

## When not to use it

- For centered content with a max-width, use `ContainerWithFixedWidth`.
- For grid layouts, use `Grid`.
- For multi-axis layouts, use `GrailLayout`.

## How to use it

Import `ContainerWithFluidWidth` and pass `paddingInline`. Required prop: `children`.

## Props

- `class` — string, default `""`. CSS class appended to `container-with-fluid-width`.
- `paddingInline` — string, default `"1rem"`. Horizontal padding CSS value.
- `children` — `Snippet`, required. Content.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import ContainerWithFluidWidth from './ContainerWithFluidWidth.svelte';
</script>

<ContainerWithFluidWidth paddingInline="clamp(1rem, 4vw, 3rem)">
  <section>Section content here.</section>
</ContainerWithFluidWidth>
```

## Accessibility

- Purely structural; no ARIA role or label.

## Related components

- `ContainerWithFixedWidth` — centered wrapper with a fixed max-width.
- `PaddingReset` — resets padding inside fluid-width containers.
- `GrailLayout` — full responsive layout with header/aside/main/footer.

## References

- MDN `padding-inline`: https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline
