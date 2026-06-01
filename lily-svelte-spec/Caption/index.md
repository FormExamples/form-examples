# Caption

A caption providing supplementary text alongside images, videos, charts, or other media. Renders a semantic `<figcaption>`, which natively associates with a parent `<figure>`.

## What it is

A headless Svelte 5 component outputting a single `<figcaption>`. Category: figure / captioning primitive, typically paired with `Figure` and `Image`/`FeaturePhoto`.

## What it does

- Renders `<figcaption class="caption {className}">`.
- Spreads additional HTML attributes onto the `<figcaption>` (including `id` for `aria-describedby` references).
- No behavior — purely content.

## When to use it

- Below an image, chart, video, or diagram inside a `<figure>` or `Figure`.
- To provide descriptive or attribution text for media.

## When not to use it

- For table captions — use `<caption>` inside a `Table`/`DataTable`/`CalendarTable` (the component already renders one when `caption` is provided).
- For floating tooltips — use `Tooltip`.
- For general body text — use `BodyText` or plain `<p>`.

## How to use it

Import `Caption` from `./Caption.svelte`. Place inside a `<figure>` or `Figure`.

## Props

- `class` — string, default `""`. CSS class appended to `caption`.
- `children` — `Snippet`, required. Caption text or content.
- `...restProps` — additional HTML attributes spread onto the `<figcaption>` (e.g. `id`).

## Usage

### Caption in a figure

```svelte
<script lang="ts">
  import Caption from './Caption.svelte';
</script>

<figure>
  <img src="/sunset.jpg" alt="Sunset over the ocean" />
  <Caption>Photo taken at Malibu beach.</Caption>
</figure>
```

### Caption for a chart referenced by aria-describedby

```svelte
<script lang="ts">
  import Caption from './Caption.svelte';
</script>

<figure aria-describedby="chart-caption">
  <svg role="img" aria-label="Revenue chart"><!-- ... --></svg>
  <Caption id="chart-caption">Figure 1: Revenue growth over time.</Caption>
</figure>
```

### Caption with inline mark-up

```svelte
<script lang="ts">
  import Caption from './Caption.svelte';
</script>

<figure>
  <img src="/poster.jpg" alt="Event poster" />
  <Caption>
    Photograph by <em>Jane Doe</em> — <a href="/license">CC BY 4.0</a>
  </Caption>
</figure>
```

### With the Figure component

```svelte
<script lang="ts">
  import Figure from '../Figure/Figure.svelte';
  import Caption from './Caption.svelte';
</script>

<Figure>
  <img src="/diagram.png" alt="System overview diagram" />
  <Caption>System overview: client → API → database.</Caption>
</Figure>
```

### Video caption

```svelte
<script lang="ts">
  import Caption from './Caption.svelte';
</script>

<figure>
  <video src="/intro.mp4" controls></video>
  <Caption>Product introduction video, 2 minutes.</Caption>
</figure>
```

## Accessibility

- `<figcaption>` automatically associates with its parent `<figure>`, providing an accessible caption for screen readers.
- Can be referenced via `id` + `aria-describedby` from other elements.
- No interactive behavior; contained links/buttons bring their own a11y.

## Related components

- `Figure` — the `<figure>` wrapper.
- `Image`, `FeaturePhoto` — image children.
- `BodyText` — general text blocks.
- `EndNotes`, `Footnote` — other kinds of supplementary text.
