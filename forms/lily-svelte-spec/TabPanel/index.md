# TabPanel

A content panel associated with a tab in a tab bar.

## What it is

A headless Svelte 5 component that renders `<div role="tabpanel" tabindex="0">`. The panel is hidden (via the native `hidden` attribute) when not selected and is focusable so keyboard users can scroll content.

## What it does

- When `labelledBy` is provided, sets `aria-labelledby` and omits `aria-label`.
- When `labelledBy` is absent, uses the required `label` prop as `aria-label`.
- Toggles the native `hidden` attribute based on `selected`.
- Renders `children` as the panel content.

## When to use it

- The content panel paired with a `TabBarButton` inside a `TabBar` group.

## When not to use it

- For a generic disclosure widget, use `Details` or `Collapsible`.
- For a side panel layout, use `SplitView` or `Drawer`.

## Props

- `class` — string, default `""`.
- `label` — string, **required**. `aria-label` fallback when `labelledBy` is absent.
- `labelledBy` — string, optional. ID of the controlling tab button.
- `selected` — boolean, default `false`.
- `children` — `Snippet`, optional. Panel content.

## Usage

```svelte
<script lang="ts">
  import TabPanel from './TabPanel.svelte';

  let current = $state('details');
</script>

<TabPanel
  label="Details"
  labelledBy="tab-details"
  selected={current === 'details'}
>
  <p>Details content…</p>
</TabPanel>
```

## Accessibility

- `role="tabpanel"` per WAI-ARIA Tabs pattern.
- `aria-labelledby` is preferred when the panel is controlled by a tab button.
- `tabindex="0"` makes the panel itself focusable for keyboard scrolling.

## Related components

- `TabBar` — tab group.
- `TabBarButton` — single tab.
- `Details` — disclosure widget.

## References

- Adobe Spectrum Tabs: https://spectrum.adobe.com/page/tabs/
- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
