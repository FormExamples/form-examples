# ActionBar

A contextual action bar that appears when items are selected, showing the selection count and bulk action buttons.

## What it is

A headless Svelte 5 component that renders a `<div>` with `role="toolbar"`. Inspired by Adobe Spectrum's ActionBar pattern. Pair with `ActionBarButton` children for bulk actions.

## What it does

- Renders a `<div class="action-bar" role="toolbar">` with `aria-label`.
- Exposes `data-selected-count` for consumer styling.
- Renders the consumer-formatted count via `<span class="action-bar-count">`.
- Renders any children (action buttons) in document order.
- Renders a clear-selection `<button>` only when both `clearSelectionLabel` and `onClearSelection` are provided.

## When to use it

- On lists, grids, or tables that support multi-select with bulk actions.
- Any contextual selection bar (delete, archive, move, share, etc.).

## When not to use it

- For a permanent toolbar without selection context, use `ToolBar`.
- For a single primary action, use `Button`.

## Props

- `class` — string, default `""`. CSS class appended to `action-bar`.
- `label` — string, **required**. `aria-label` for the toolbar.
- `selectedCount` — number, **required**. Selection count exposed as `data-selected-count`.
- `selectedCountLabel` — string, **required**. Pre-formatted display string (locale-formatted by consumer).
- `clearSelectionLabel` — string, optional. Accessible label for clear button.
- `onClearSelection` — `() => void`, optional. Click handler for clear button.
- `children` — `Snippet`, optional. Action button children.

## Usage

```svelte
<script lang="ts">
  import ActionBar from './ActionBar.svelte';
  import ActionBarButton from '../ActionBarButton/ActionBarButton.svelte';

  let count = $state(3);
</script>

<ActionBar
  label="Bulk actions"
  selectedCount={count}
  selectedCountLabel={`${count} selected`}
  clearSelectionLabel="Clear selection"
  onClearSelection={() => (count = 0)}
>
  <ActionBarButton label="Delete">Delete</ActionBarButton>
  <ActionBarButton label="Archive">Archive</ActionBarButton>
</ActionBar>
```

## Accessibility

- `role="toolbar"` and `aria-label` describe the bar to assistive tech.
- The clear button's accessible name is the `clearSelectionLabel`.
- Use Tab/Shift+Tab to navigate buttons.

## Related components

- `ActionBarButton` — buttons rendered inside an action bar.
- `ToolBar` — permanent (non-contextual) horizontal toolbar.
- `Button` — generic button.

## References

- Adobe Spectrum ActionBar: https://spectrum.adobe.com/page/action-bar/
- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
