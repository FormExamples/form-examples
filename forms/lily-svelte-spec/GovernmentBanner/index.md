# GovernmentBanner

A banner identifying a website as belonging to a government, with an expandable details panel. This headless Svelte component renders an `<aside>` complementary landmark.

## What it is

A headless Svelte 5 component inspired by the U.S. Web Design System (USWDS) Banner pattern. Category: site identity / status banners.

## What it does

- Renders an `<aside>` with the base class `government-banner` plus consumer `class`.
- Adds the **required** `aria-label` to name the banner.
- Renders a `<header class="government-banner-header">` containing the **required** `headerText` and a toggle `<button>` with the **required** `expandLabel`.
- Wires the toggle button to the panel via `aria-expanded` and `aria-controls`. A stable id is generated automatically (or accepted via the `panelId` prop) using `crypto.randomUUID()` with a `Math.random()` fallback.
- Hides the panel via the boolean `hidden` attribute when collapsed.
- Calls `ontoggle(next)` with the next expanded state when the button is clicked.

## When to use it

- The very top of a government website to identify the site as official.

## When not to use it

- For non-government context, use `Banner` or `SuperBanner`.
- For dismissible alerts, use `Alert` or `Notification`.

## Props

- `class` — string, default `""`. CSS class appended to `government-banner`.
- `label` — string, **required**. `aria-label` for the `<aside>`.
- `headerText` — string, **required**. Top headline text.
- `expandLabel` — string, **required**. Toggle button text.
- `expanded` — boolean, default `false`. Panel open state.
- `ontoggle` — `(next: boolean) => void`, optional. Toggle handler.
- `panelId` — string, optional. Stable panel id; auto-generated when omitted.
- `children` — `Snippet`, optional. Details panel content.
- `...restProps` — additional HTML attributes spread onto the `<aside>`.

## Usage

```svelte
<script lang="ts">
  import GovernmentBanner from './GovernmentBanner.svelte';

  let expanded = $state(false);
</script>

<GovernmentBanner
  label="Official government website"
  headerText="An official website of the United States government"
  expandLabel="Here's how you know"
  expanded={expanded}
  ontoggle={(next) => (expanded = next)}
>
  <p>Official websites use .gov</p>
  <p>Secure .gov websites use HTTPS</p>
</GovernmentBanner>
```

## Accessibility

- `<aside>` is a complementary landmark exposed via `aria-label`.
- The toggle button exposes `aria-expanded` and `aria-controls`.
- The collapsed panel is hidden via the `hidden` attribute so it is removed from the accessibility tree.

## Related components

- `Banner` — generic prominent message bar.
- `SuperBanner` — high-priority system banner.

## References

- USWDS Banner: https://designsystem.digital.gov/components/banner/
- WAI-ARIA disclosure pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
