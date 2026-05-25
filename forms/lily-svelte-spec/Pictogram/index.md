# Pictogram

An icon-based component pairing an icon with a title and description in a centered or side layout. This headless Svelte component renders a `<figure>` element with the icon marked decorative.

## What it is

A headless Svelte 5 component rendering a `<figure>` containing an `aria-hidden` icon container and a `<figcaption>` with optional heading and body text. Category: content / iconography.

## What it does

- Renders a `<figure>` with the base class `pictogram` plus consumer `class`.
- Sets `data-layout` from `layout` (`"centered" | "side"`).
- **Requires** an `icon` Snippet prop (NOT children).
- Renders the icon inside `<div class="pictogram-icon" aria-hidden="true">`.
- Renders an optional `<h3 class="pictogram-heading">` and `<p class="pictogram-description">` inside `<figcaption>`.
- `children` overrides the `description` paragraph for fully custom caption content.

## When to use it

- Feature highlights paired with illustrations.
- Topic landing tiles using consistent iconography.

## When not to use it

- For just a labelled icon with no body text, use `Icon` plus a label element.
- For a content card with a hero image, use `FeatureCard`.

## Props

- `class` — string, default `""`.
- `layout` — `"centered" | "side"`, default `"centered"`.
- `heading` — string, optional.
- `description` — string, optional.
- `icon` — `Snippet`, **required**. Icon/illustration content.
- `label` — string, optional. `aria-label` override.
- `children` — `Snippet`, optional. Overrides description.
- `...restProps` — additional HTML attributes spread onto the `<figure>`.

## Usage

```svelte
<script lang="ts">
  import Pictogram from './Pictogram.svelte';
</script>

<Pictogram heading="Privacy" description="Your data stays yours.">
  {#snippet icon()}
    <span aria-hidden="true">🔒</span>
  {/snippet}
</Pictogram>
```

## Accessibility

- `<figure>` semantics with optional `aria-label`.
- Icon container is `aria-hidden="true"`; the accessible name comes from the heading or `label`.

## Related components

- `FeatureCard` — content card with image, heading, and CTAs.
- `Icon` — generic icon container.

## References

- HTML `<figure>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
- Mozilla Protocol Design System: https://protocol.mozilla.org
