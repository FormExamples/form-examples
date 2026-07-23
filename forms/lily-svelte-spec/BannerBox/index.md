# BannerBox

A layout box placed inside a `Banner` to arrange its content using flexbox horizontal (via consumer CSS). Renders a single `<div>` with an optional `aria-label`.

## What it is

A headless Svelte 5 layout wrapper for `Banner` content. Category: banner layout primitive, sibling to `Banner`, `SuperBanner`, `MedicalBanner`.

## What it does

- Renders `<div class="banner-box {className}" aria-label={label}>`.
- `aria-label` attribute is always written; when `label` is undefined the attribute evaluates to no accessible name (consumer can simply omit the prop).
- Spreads additional HTML attributes onto the `<div>`.
- Provides no behavior; consumers apply `display: flex; flex-direction: row;` via CSS.

## When to use it

- Inside a `Banner` to lay out a message next to action buttons, icons, or links.
- When horizontal flex layout is desired for banner content.

## When not to use it

- Outside a `Banner` — it has no specific meaning there.
- For medical banner content — use `MedicalBannerBox` (or its danger/advice variants).
- For generic flex layouts — use a plain `<div>`.

## How to use it

Import `BannerBox` from `./BannerBox.svelte`. Place as a direct child of `Banner`. Put message plus actions inside.

## Props

- `class` — string, default `""`. CSS class appended to `banner-box`.
- `label` — string, optional. Accessible name via `aria-label`.
- `children` — `Snippet`, required. Contents of the banner box.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Simple message with action

```svelte
<script lang="ts">
  import Banner from '../Banner/Banner.svelte';
  import BannerBox from './BannerBox.svelte';
</script>

<Banner>
  <BannerBox>
    <span>Important announcement</span>
    <a href="/learn-more">Learn more</a>
  </BannerBox>
</Banner>
```

### With accessible label

```svelte
<script lang="ts">
  import Banner from '../Banner/Banner.svelte';
  import BannerBox from './BannerBox.svelte';
</script>

<Banner type="warning">
  <BannerBox label="Session expiration notice">
    <span>Your session ends soon.</span>
    <button type="button">Extend</button>
  </BannerBox>
</Banner>
```

### Multiple boxes inside a banner

```svelte
<script lang="ts">
  import Banner from '../Banner/Banner.svelte';
  import BannerBox from './BannerBox.svelte';
</script>

<Banner>
  <BannerBox><strong>Update</strong></BannerBox>
  <BannerBox>
    <span>New features available.</span>
    <a href="/whats-new">See what's new</a>
  </BannerBox>
</Banner>
```

### Cookie consent layout

```svelte
<script lang="ts">
  import Banner from '../Banner/Banner.svelte';
  import BannerBox from './BannerBox.svelte';
  import Button from '../Button/Button.svelte';
</script>

<Banner type="info">
  <BannerBox>
    <span>We use cookies to improve your experience.</span>
    <Button>Accept</Button>
    <Button>Decline</Button>
  </BannerBox>
</Banner>
```

### With data attribute for tests

```svelte
<BannerBox data-testid="promo-row">
  <span>Sale today only</span>
  <a href="/shop">Shop now</a>
</BannerBox>
```

## Accessibility

- No role by default; the parent `Banner` provides the `region` landmark and live region.
- Optional `aria-label` when the content alone is not self-explanatory.
- Not interactive; contained elements handle their own a11y.

## Related components

- `Banner` — required outer container.
- `MedicalBanner`, `MedicalBannerBox`, `MedicalBannerBoxForDanger`, `MedicalBannerBoxForAdvice` — medical variants.
- `SuperBanner` — higher-priority banner.

---

Lily™ and Lily Design System™ are trademarks.
