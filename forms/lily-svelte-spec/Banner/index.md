# Banner

A prominent message bar, typically across the top or bottom of a page, that announces site-wide information. Renders a `<div role="region" aria-live="polite">` with optional dismiss button. Supports internal dismiss state so the banner is removed from the DOM once closed.

## What it is

A headless Svelte 5 component outputting a `<div>` wrapping the message and an optional unlabeled `<button type="button">` for dismissal. Category: page-level messaging primitive alongside `SuperBanner`, `MedicalBanner`, and `Alert`.

## What it does

- Maintains internal `visible` state initialized to `true`.
- Conditionally renders `<div class="banner {className}" role="region" aria-live="polite" data-type={type}>` while visible.
- Renders children as the main message.
- If `dismissible` is true, renders a bare `<button type="button" aria-label={closeLabel}>` that flips `visible` to `false` and invokes `onclose()`.
- Spreads additional HTML attributes onto the `<div>`.

## When to use it

- Site-wide announcements: maintenance notices, cookie consent, session warnings.
- Persistent (but dismissible) info at the top or bottom of the viewport.
- Promotional banners with a clear close affordance.

## When not to use it

- For modal urgent messages — use `AlertDialog`.
- For transient notifications — use `Toast` / `Sonner`.
- For medical context — use `MedicalBanner`.
- For the highest-priority system-wide state — use `SuperBanner`.
- For inline feedback messaging within a page — use `Alert`.

## How to use it

Import `Banner` from `./Banner.svelte`. Provide children as the message. For dismissal, set `dismissible`, provide a `closeLabel`, and optionally handle `onclose`.

## Props

- `class` — string, default `""`. CSS class appended to `banner`.
- `type` — `"info" | "success" | "warning" | "error"`, default `"info"`.
- `dismissible` — boolean, default `false`.
- `onclose` — `() => void`, optional. Fires after visibility is set to false.
- `closeLabel` — string, optional. Accessible name for the dismiss button.
- `children` — `Snippet`, required. Banner content.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Simple info banner

```svelte
<script lang="ts">
  import Banner from './Banner.svelte';
</script>

<Banner>Important announcement here.</Banner>
```

### Dismissible warning

```svelte
<script lang="ts">
  import Banner from './Banner.svelte';

  function handleDismiss() {
    console.log('banner closed');
  }
</script>

<Banner
  type="warning"
  dismissible
  closeLabel="Dismiss"
  onclose={handleDismiss}
>
  Your session will expire in 5 minutes.
</Banner>
```

### With a BannerBox for horizontal layout

```svelte
<script lang="ts">
  import Banner from './Banner.svelte';
  import BannerBox from '../BannerBox/BannerBox.svelte';
</script>

<Banner type="info" dismissible closeLabel="Close">
  <BannerBox>
    <span>We use cookies to improve your experience.</span>
    <a href="/cookies">Learn more</a>
  </BannerBox>
</Banner>
```

### Error banner, non-dismissible

```svelte
<script lang="ts">
  import Banner from './Banner.svelte';
</script>

<Banner type="error" data-testid="outage-banner">
  Service unavailable. Please try again later.
</Banner>
```

### Controlled via external state

```svelte
<script lang="ts">
  import Banner from './Banner.svelte';

  let accepted = $state(false);
</script>

{#if !accepted}
  <Banner type="info" dismissible closeLabel="Accept" onclose={() => (accepted = true)}>
    By using this site you accept our terms.
  </Banner>
{/if}
```

## Accessibility

- `role="region"` marks the banner as a landmark (consumers should ensure uniqueness or supply `aria-label` on multiple banners).
- `aria-live="polite"` announces content changes without interrupting.
- The dismiss button has `aria-label={closeLabel}`; since the button has no children, `closeLabel` must be provided for an accessible name.
- `data-type` is a styling hook, not an ARIA signal.
- Keyboard: dismiss button is focusable; Enter/Space activate it natively.

## Related components

- `BannerBox` — flexbox layout inside a `Banner`.
- `SuperBanner` — highest-priority system-state banner.
- `MedicalBanner`, `MedicalBannerBox`, `MedicalBannerBoxForDanger`, `MedicalBannerBoxForAdvice` — medical variants.
- `Alert` — inline status message.
- `Toast`, `Sonner` — transient notifications.
- `AlertDialog` — modal acknowledgment dialog.

---

Lily™ and Lily Design System™ are trademarks.
