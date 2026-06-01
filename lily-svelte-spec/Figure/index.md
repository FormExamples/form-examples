# Figure

A container for graphical content such as charts, diagrams, illustrations, and data visualisations. Renders `<figure role="img">` with an accessible label.

## What it is

`Figure` is a structural wrapper around the native `<figure>` element, adding `role="img"` and a required `aria-label`. It does not supply any chart or visualisation — consumers provide SVG, canvas, or any other visual content as children.

## What it does

- Renders `<figure class="figure" role="img" aria-label={label}>`.
- Forwards `restProps` onto the `<figure>`.

## When to use it

- Dashboards, reports, and analytics screens where a labelled figure is needed.
- Any graphical region that should be announced to assistive technology as a single image.
- Wrapping bespoke chart components with proper `aria-label` semantics.

## When not to use it

- When you need a caption below the figure. Render a `<figcaption>` yourself inside the children, or combine with `Caption`.
- When the content is purely decorative. Add `aria-hidden="true"` to a plain `<figure>`.
- For responsive photographs with alt text. Use `FeaturePhoto` or `Image`.

## How to use it

Pass the visualization content as children and a descriptive `label`.

```svelte
<script lang="ts">
    import Figure from "./Figure.svelte";
</script>

<Figure label="Monthly revenue for 2026">
    <svg><!-- bar chart SVG --></svg>
</Figure>
```

## Props

| Prop       | Type       | Default  | Description                                   |
| ---------- | ---------- | -------- | --------------------------------------------- |
| `class`    | `string`   | `""`     | CSS class appended to the base class.        |
| `label`    | `string`   | required | Accessible description via `aria-label`.      |
| `children` | `Snippet`  | required | Figure content (SVG, canvas, component, etc.).|
| `...rest`  | `unknown`  | —        | Additional HTML attributes on the `<figure>`. |

## Usage

### 1. Bar chart

```svelte
<Figure label="Monthly revenue for 2026">
    <svg><!-- bar chart SVG here --></svg>
</Figure>
```

### 2. Canvas visualisation

```svelte
<Figure label="User growth trend">
    <canvas bind:this={canvas} width="600" height="300"></canvas>
</Figure>
```

### 3. With a figcaption inside

```svelte
<Figure label="Users by region">
    <svg><!-- map --></svg>
    <figcaption>Active users as of March 2026</figcaption>
</Figure>
```

### 4. Wrapping a chart component

```svelte
<Figure label="Weekly active users">
    <Sparkline data={users} />
</Figure>
```

### 5. Localised label

```svelte
<Figure label="Ingresos mensuales">
    <svg><!-- gráfico --></svg>
</Figure>
```

## Accessibility

- `role="img"` tells assistive technology to treat the figure as a single image.
- `aria-label` provides a concise description; use longer explanations with `aria-describedby` if needed.
- If the content has meaningful text, consider whether `role="img"` is still appropriate or whether you should omit it so individual elements remain accessible.

## Related components

- `Caption` — caption for a table or figure element.
- `GraphicBlock` — richer wrapper with title, description, notes, and ARIA description.
- `FeaturePhoto`, `Image` — photographic content.
- `Sparkline`, `Chart` components — chart primitives suitable as children.
