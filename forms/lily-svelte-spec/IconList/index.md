# IconList

A list of icon list item components. This headless Svelte component renders a `<ul>` with the base class `icon-list` and an optional `aria-label`.

## What it is

A headless Svelte 5 component inspired by the U.S. Web Design System (USWDS) Icon list pattern. The wrapper for `IconListItem` children. Category: lists.

## What it does

- Renders a `<ul>` with the base class `icon-list` plus consumer `class`.
- Adds an optional `aria-label` to name the list.
- Spreads `...restProps` onto the `<ul>`.

## When to use it

- For a feature list, benefits list, or status list where each item has an icon.

## When not to use it

- For numbered steps, use `StepList`.
- For rich cards, use `CollectionList`.

## Props

- `class` — string, default `""`. CSS class appended to `icon-list`.
- `label` — string, optional. `aria-label` naming the list.
- `children` — `Snippet`, required. Icon list item children.
- `...restProps` — additional HTML attributes spread onto the `<ul>`.

## Usage

```svelte
<script lang="ts">
  import IconList from './IconList.svelte';
  import IconListItem from '../IconListItem/IconListItem.svelte';
</script>

<IconList label="Features">
  <IconListItem>Fast</IconListItem>
  <IconListItem>Accessible</IconListItem>
</IconList>
```

## Accessibility

- `<ul>` conveys list semantics natively.
- Optional `aria-label` names the list when context is unclear.

## Related components

- `IconListItem` — one item with a leading icon.
- `CheckList` — list with check-style items.
- `StepList` — numbered steps.

## References

- USWDS Icon list: https://designsystem.digital.gov/components/icon-list/
