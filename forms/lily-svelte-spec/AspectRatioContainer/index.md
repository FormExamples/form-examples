# AspectRatioContainer

A layout container that maintains a fixed width-to-height aspect ratio using the CSS `aspect-ratio` property. Useful for responsive images, videos, cards, and any content that must keep consistent proportions across viewport sizes.

## What it is

A headless Svelte 5 layout utility rendering a single `<div>` with an inline `aspect-ratio` style. Category: layout primitive, alongside `ArticleLayout`, `ContentBlock`, `Framer`, and the `GrailLayout` family.

## What it does

- Renders `<div class="aspect-ratio-container {className}" style:aspect-ratio={ratio} data-aspect-ratio-container={ratio}>`.
- Sets the CSS `aspect-ratio` property inline from the `ratio` prop.
- Exposes `data-aspect-ratio-container` with the numeric value as a styling hook.
- Spreads additional HTML attributes onto the `<div>`.
- Does not apply `overflow: hidden` — clipping is the consumer's responsibility.

## When to use it

- Embedding video players or iframes at 16:9.
- Fixed 1:1 avatar frames or square thumbnails.
- Any responsive image/video that must keep a specific ratio as the container resizes.

## When not to use it

- For text content whose height depends on content — use normal block layout.
- For application layout scaffolding — use `GrailLayout` or `ArticleLayout`.
- For content width constraints — use `ContentBlock`.

## How to use it

Import `AspectRatioContainer` from `./AspectRatioContainer.svelte`. Provide the `ratio` as a number (e.g. `16 / 9`). Place your content inside.

## Props

- `class` — string, default `""`. CSS class appended to `aspect-ratio-container`.
- `ratio` — number, default `1`. Width divided by height (`16 / 9`, `4 / 3`, `1`, `21 / 9`).
- `children` — `Snippet`, required. Content kept within the ratio.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### 16:9 video

```svelte
<script lang="ts">
  import AspectRatioContainer from './AspectRatioContainer.svelte';
</script>

<AspectRatioContainer ratio={16 / 9}>
  <video src="promo.mp4" controls></video>
</AspectRatioContainer>
```

### Square avatar frame

```svelte
<script lang="ts">
  import AspectRatioContainer from './AspectRatioContainer.svelte';
</script>

<AspectRatioContainer ratio={1}>
  <img src="/photos/jane.jpg" alt="Jane Doe" />
</AspectRatioContainer>
```

### 4:3 card

```svelte
<script lang="ts">
  import AspectRatioContainer from './AspectRatioContainer.svelte';
</script>

<AspectRatioContainer ratio={4 / 3} data-testid="card-frame">
  <article>
    <h3>Product name</h3>
    <p>Description here.</p>
  </article>
</AspectRatioContainer>
```

### Ultrawide 21:9 banner image

```svelte
<script lang="ts">
  import AspectRatioContainer from './AspectRatioContainer.svelte';
</script>

<AspectRatioContainer ratio={21 / 9}>
  <img src="/hero.jpg" alt="Mountains at sunrise" />
</AspectRatioContainer>
```

### Reactive ratio

```svelte
<script lang="ts">
  import AspectRatioContainer from './AspectRatioContainer.svelte';

  let isPortrait = $state(false);
  let ratio = $derived(isPortrait ? 3 / 4 : 4 / 3);
</script>

<button onclick={() => (isPortrait = !isPortrait)}>Toggle orientation</button>
<AspectRatioContainer {ratio}>
  <img src="/photo.jpg" alt="Photo" />
</AspectRatioContainer>
```

## Accessibility

- No ARIA role required; the container is purely layout.
- Children keep their own accessibility semantics (alt text on images, controls on videos).
- `data-aspect-ratio-container` is for styling hooks, not for assistive tech.

## Related components

- `Framer` — decorative framed content.
- `Image`, `FeaturePhoto` — image elements that commonly go inside.
- `Figure` + `Caption` — figure with descriptive caption.
- `ArticleLayout`, `ContentBlock`, `GrailLayout*` — higher-level layout containers.

---

Lily™ and Lily Design System™ are trademarks.
