# IconListItem

One item in an `IconList` with an optional leading-icon snippet and required text content. This headless Svelte component renders an `<li>`.

## What it is

A headless Svelte 5 component inspired by the U.S. Web Design System (USWDS) Icon list pattern. Category: lists.

## What it does

- Renders an `<li>` with the base class `icon-list-item` plus consumer `class`.
- Renders an optional leading icon inside `<span class="icon-list-item-icon" aria-hidden="true">` so it is treated as decorative.
- Renders text content inside `<span class="icon-list-item-text">`.
- Spreads `...restProps` onto the `<li>`.

## When to use it

- Inside `IconList` for feature, benefit, or status entries.

## When not to use it

- For numbered steps, use `StepListItem`.
- For checkboxes with state, use `CheckListItem`.

## Props

- `class` — string, default `""`. CSS class appended to `icon-list-item`.
- `icon` — `Snippet`, optional. Decorative leading icon snippet.
- `children` — `Snippet`, required. Text content.
- `...restProps` — additional HTML attributes spread onto the `<li>`.

## Usage

```svelte
<script lang="ts">
  import IconListItem from './IconListItem.svelte';
</script>

{#snippet starIcon()}
  <span>★</span>
{/snippet}

<IconListItem icon={starIcon}>Featured</IconListItem>
```

## Accessibility

- The icon span carries `aria-hidden="true"` so screen readers ignore decorative glyphs.
- The accessible name comes from the text content children.
- If the icon conveys meaning that text does not, supply textual children describing it.

## Related components

- `IconList` — the parent list wrapper.
- `Icon` — generic icon container.

## References

- USWDS Icon list: https://designsystem.digital.gov/components/icon-list/
