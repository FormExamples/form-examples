# StickyPromoBanner

A fixed-position promotional banner with an optional dismiss button. This headless Svelte component renders an `<aside role="complementary">` pinned to the top or bottom of the viewport.

## What it is

A headless Svelte 5 component that renders a sticky `<aside>` with a content slot and an optional dismiss button. Category: notifications / promotions.

## What it does

- Renders an `<aside>` with the base class `sticky-promo-banner` plus consumer `class`.
- **Requires** `label` (region aria-label) and `dismissLabel` (dismiss button aria-label).
- Sets `role="complementary"`, `aria-label`, and `data-position`.
- Toggles the native `hidden` attribute based on `open` (default `true`).
- Applies the documented inline `position: fixed; left: 0; right: 0;` plus `top: 0` or `bottom: 0` based on `position`.
- Renders the dismiss `<button>` only when an `ondismiss` handler is provided.

## Inline styles

This component is the only headless Lily component that uses inline styles, because sticky positioning is core to its behavior. The inline styles are limited to:

- `position: fixed`
- `left: 0; right: 0`
- `top: 0` or `bottom: 0` depending on `position`

All other visual styling (colors, padding, typography, shadow) must come from consumer CSS.

## When to use it

- A persistent promotional message (e.g. "Save 20% this week").
- A cookie-consent or geo-redirect prompt that needs to remain in view.

## When not to use it

- For a top-of-page non-sticky message bar, use `Banner`.
- For an urgent system status banner, use `SuperBanner`.
- For toast-style ephemeral messages, use `Toast` or `Sonner`.

## Props

- `class` — string, default `""`.
- `label` — string, **required**. `aria-label` for the aside region.
- `open` — boolean, default `true`.
- `position` — `"top" | "bottom"`, default `"bottom"`.
- `dismissLabel` — string, **required**.
- `ondismiss` — `(event: MouseEvent) => void`, optional. When omitted, the dismiss button is not rendered.
- `children` — `Snippet`, optional. Banner content.
- `...restProps` — additional HTML attributes spread onto the `<aside>`.

## Usage

```svelte
<script lang="ts">
  import StickyPromoBanner from './StickyPromoBanner.svelte';

  let open = $state(true);
</script>

<StickyPromoBanner
  label="Promotional banner"
  dismissLabel="Dismiss banner"
  position="bottom"
  {open}
  ondismiss={() => (open = false)}
>
  <p>Special offer: free shipping this week.</p>
</StickyPromoBanner>
```

## Accessibility

- `<aside role="complementary">` provides a complementary landmark with an accessible name from `label`.
- The dismiss button is a real `<button type="button">` with `aria-label`.

## Related components

- `Banner` — non-sticky page-level message bar.
- `SuperBanner` — high-priority system message.
- `Toast` / `Sonner` — ephemeral notifications.

## References

- WAI-ARIA `role="complementary"`: https://www.w3.org/TR/wai-aria-1.2/#complementary
- Mozilla Protocol Design System: https://protocol.mozilla.org
