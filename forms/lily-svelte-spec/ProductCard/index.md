# ProductCard

A specialized card for displaying a product with image, title, price, and additional content. This headless Svelte component renders an `<article>` landmark with an accessible name from `name` (or `label` override), an optional image, and a header containing the product name in an `<h3>` and a pre-formatted price.

## What it is

A headless Svelte 5 component that renders a single `<article>` element. Category: commerce / catalog display.

## What it does

- Renders an `<article>` with the base class `product-card` plus consumer `class`.
- Sets `aria-label` to `label` (if provided) or the `name`.
- Optionally renders `<img class="product-card-image">` when `imageUrl` is provided.
- Renders a `<header class="product-card-header">` containing `<h3 class="product-card-name">{name}</h3>` and `<p class="product-card-price">{price}</p>`.
- Renders any `children` after the header for description, actions, badges, etc.
- Spreads `...restProps`.

## When to use it

- Catalog grid displaying products for sale.
- Cross-sell / upsell tiles.
- Product detail summaries within larger pages.

## When not to use it

- For a generic content card, use `Card`.
- For an article tile, use `Tile`.
- For a healthcare instruction card, use `CareCard`.

## Props

- `class` — string, default `""`. CSS class appended to `product-card`.
- `name` — string, **required**. Product name.
- `price` — string, **required**. Pre-formatted price text.
- `imageUrl` — string, optional. Product image source.
- `imageAlt` — string, optional. Image alt text.
- `label` — string, optional. Accessible label override.
- `children` — `Snippet`, optional. Additional content (description, actions).
- `...restProps` — additional HTML attributes spread onto the `<article>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import ProductCard from './ProductCard.svelte';
  import Button from '../Button/Button.svelte';

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(24);
</script>

<ProductCard name="Linen Pillow" price={price} imageUrl="/pillow.jpg" imageAlt="Linen pillow on a bed">
  <p>Soft and breathable linen pillow.</p>
  <Button>Add to cart</Button>
</ProductCard>
```

## Accessibility

- `<article>` is a landmark; its accessible name comes from `aria-label` (defaulting to `name`).
- Always pass meaningful `imageAlt`. If the image is purely decorative, pass an empty string `""`.
- Currency formatting is the consumer's responsibility — pass a fully formatted price string for proper screen-reader output.

## Related components

- `Card` — generic grouped content container.
- `Tile` — clickable structured content tile.
- `CareCard` — medical care instruction card.
- `FeaturePhoto` — responsive photo with lazy loading.

## References

- MDN `<article>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
- WCAG 2.2 — Non-text Content (1.1.1): https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html
