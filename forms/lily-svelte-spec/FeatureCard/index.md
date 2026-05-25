# FeatureCard

A large content card with a prominent image positioned alongside or above the text. This headless Svelte component renders an `<article>` landmark with a labelled accessible name.

## What it is

A headless Svelte 5 component rendering an `<article>` landmark containing an optional image, header with heading, optional description, and arbitrary children for CTAs. Category: content / cards.

## What it does

- Renders an `<article>` with the base class `feature-card` plus consumer `class`.
- **Requires** `heading`.
- Sets `data-image-position` from `imagePosition` (`"start" | "end" | "top"`).
- Sets `aria-label` from `label` or, by default, from `heading`.
- Renders an `<img class="feature-card-image">` when `imageUrl` is provided.
- Renders the heading inside `<header><h3>`.
- Renders an optional `<p class="feature-card-description">` when `description` is provided.
- Renders children for additional content (e.g. CTAs).

## When to use it

- Marketing or landing pages with several feature cards.
- Side-by-side image + text layouts in a card grid.

## When not to use it

- For a smaller content card without a prominent image, use `Card`.
- For a product-specific layout, use `ProductCard`.

## Props

- `class` — string, default `""`. CSS class appended to `feature-card`.
- `heading` — string, **required**. Card heading.
- `imagePosition` — `"start" | "end" | "top"`, default `"start"`.
- `imageUrl` — string, optional.
- `imageAlt` — string, optional.
- `description` — string, optional.
- `label` — string, optional. `aria-label` override (defaults to `heading`).
- `children` — `Snippet`, optional. Additional content e.g. CTAs.
- `...restProps` — additional HTML attributes spread onto the `<article>`.

## Usage

```svelte
<script lang="ts">
  import FeatureCard from './FeatureCard.svelte';
</script>

<FeatureCard
  heading="Privacy first"
  description="Your data stays yours."
  imageUrl="/img/lock.png"
  imageAlt=""
  imagePosition="start"
>
  <a href="/learn">Learn more</a>
</FeatureCard>
```

## Accessibility

- The `<article>` provides a landmark with an accessible name from `label` or `heading`.
- Decorative images should pass `imageAlt=""`.

## Related components

- `Card` — generic grouped content container.
- `ProductCard` — specialized product card.
- `Hero` — large header area with title and description.

## References

- HTML `<article>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
- Mozilla Protocol Design System: https://protocol.mozilla.org
