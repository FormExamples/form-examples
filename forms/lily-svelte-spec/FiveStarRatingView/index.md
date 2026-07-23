# FiveStarRatingView

A read-only five-star rating display that renders filled (★) and empty (☆) Unicode star characters to visually represent a rating value from 0 to 5. It is the display-only companion to `FiveStarRatingPicker` in the Input/View pattern.

## What it is

A Svelte 5 component that renders an outer `<span>` with `role="img"` and `aria-label={label}`, containing five inner `<span aria-hidden="true">` elements. Each inner span holds ★ when filled and ☆ when empty based on the `value` prop.

## What it does

- Renders an outer `<span class="five-star-rating-view ...">` with `role="img"`, `aria-label`, and `data-value={value}`.
- Iterates `[1,2,3,4,5]` and renders an inner `<span aria-hidden="true" data-filled={value >= star}>` containing "★" if `value >= star`, otherwise "☆".
- Exposes `data-filled` (true/false) on each inner span and `data-value` on the outer span for consumer CSS targeting.

## When to use it

- Showing a previously captured rating on product cards, review summaries, and user profiles.
- Display-only contexts where the rating must not be editable.
- Rendering ratings next to reviewer names or review excerpts.

## When not to use it

- When users need to choose or change the rating. Use `FiveStarRatingPicker` (or `FiveStarRatingPickerButton`).
- When the scale is not a 1-5 star scale. Use a different rating component (e.g. `NetPromoterScoreView`, `FiveFaceRatingView`).
- For purely decorative stars with no conveyed rating. Use plain icons instead.

## How to use it

Pass the numeric `value` (0-5) and a descriptive `label` (e.g. "4 out of 5 stars"). The consumer provides all CSS; the component only emits semantic markup plus data hooks.

## Props

- `class` (string, optional) - CSS class appended after the base `five-star-rating-view` class.
- `value` (number, required) - The rating value (0-5) to display.
- `label` (string, required) - Accessible description via `aria-label` (e.g. "4 out of 5 stars").
- `...restProps` - Additional HTML attributes spread onto the outer `<span>`.

## Usage

```svelte
<script lang="ts">
    import FiveStarRatingView from "./FiveStarRatingView.svelte";
</script>

<FiveStarRatingView value={4} label="4 out of 5 stars" />
```

```svelte
<script lang="ts">
    import FiveStarRatingView from "./FiveStarRatingView.svelte";
</script>

<FiveStarRatingView value={0} label="No rating yet" />
```

```svelte
<script lang="ts">
    import FiveStarRatingView from "./FiveStarRatingView.svelte";
    const review = { author: "Pat", rating: 5, excerpt: "Excellent." };
</script>

<article>
    <p>{review.author}</p>
    <FiveStarRatingView
        value={review.rating}
        label={`${review.rating} out of 5 stars`}
    />
    <p>{review.excerpt}</p>
</article>
```

```svelte
<script lang="ts">
    import FiveStarRatingView from "./FiveStarRatingView.svelte";
</script>

<FiveStarRatingView
    value={3}
    label="Average rating: 3 stars"
    class="product-rating"
    data-testid="avg-stars"
/>
```

```svelte
<script lang="ts">
    import FiveStarRatingPicker from "../FiveStarRatingPicker/FiveStarRatingPicker.svelte";
    import FiveStarRatingView from "./FiveStarRatingView.svelte";
    let rating = $state(0);
    let saved = $state(0);
</script>

{#if saved > 0}
    <FiveStarRatingView value={saved} label={`${saved} out of 5 stars`} />
{:else}
    <FiveStarRatingPicker label="Rate this" bind:value={rating} />
    <button onclick={() => (saved = rating)}>Save</button>
{/if}
```

## Accessibility

- `role="img"` on the outer span indicates the grouped stars represent a single visual/graphic element.
- `aria-label` gives the full rating description (e.g. "4 out of 5 stars"); screen readers read this instead of the individual star characters.
- Inner star spans use `aria-hidden="true"` so screen readers do not read "black star black star ..." character-by-character.
- No keyboard interaction - it is a passive, read-only element.

## Related components

- `FiveStarRatingPicker` - interactive radiogroup for selecting a 1-5 star rating.
- `FiveStarRatingPickerButton` - single-button variant for custom pickers.
- `FiveFaceRatingView` - read-only face-based satisfaction rating.
- `NetPromoterScoreView` - read-only NPS 0-10 display.
- `RedAmberGreenView` - read-only status indicator.

---

Lily™ and Lily Design System™ are trademarks.
