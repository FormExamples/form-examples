# SummaryBox

A boxed callout highlighting key takeaways or next steps from a longer page. This headless Svelte component renders an `<aside>` complementary landmark.

## What it is

A headless Svelte 5 component inspired by the U.S. Web Design System (USWDS) Summary box. Category: callouts.

## What it does

- Renders an `<aside>` with the base class `summary-box` plus consumer `class`.
- Sets `aria-label` to the optional `label` prop, falling back to the **required** `heading`.
- Renders the heading in `<h3 class="summary-box-heading">`.
- Renders body content in `<div class="summary-box-body">`.
- Spreads `...restProps` onto the `<aside>`.

## When to use it

- Pull out the most important information at the top of a long page.
- Surface a list of next steps or required actions.

## When not to use it

- For inline emphasis, use `InsetText`.
- For status messages, use `Alert`.
- For warnings, use `WarningCallout`.

## Props

- `class` — string, default `""`. CSS class appended to `summary-box`.
- `heading` — string, **required**. Box heading text.
- `label` — string, optional. `aria-label` override; defaults to heading.
- `children` — `Snippet`, optional. Body content.
- `...restProps` — additional HTML attributes spread onto the `<aside>`.

## Usage

```svelte
<script lang="ts">
  import SummaryBox from './SummaryBox.svelte';
</script>

<SummaryBox heading="Key information">
  <ul>
    <li>Apply by April 30</li>
    <li>Bring photo ID</li>
  </ul>
</SummaryBox>
```

## Accessibility

- `<aside>` is a complementary landmark, named via `aria-label`.
- The heading is `<h3>` by default; manage overall heading hierarchy at the page level.

## Related components

- `InformationCallout` — informational callout.
- `WarningCallout` — warning callout.
- `Alert` — page-level alerts.

## References

- USWDS Summary box: https://designsystem.digital.gov/components/summary-box/
