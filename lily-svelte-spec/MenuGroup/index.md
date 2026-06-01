# MenuGroup

A labeled section of menu items within a menu.

## What it is

A headless Svelte 5 component that renders `<div class="menu-group" role="group" aria-label={label}>` containing a visible heading and the consumer's menu items.

## What it does

- Sets `role="group"` and `aria-label` to convey the section name to AT.
- Renders a visible `<div class="menu-group-heading" aria-hidden="true">` so the heading is shown but not double-announced by screen readers (AT already gets the name from `aria-label`).

## When to use it

- Inside a `Menu`, `DropdownMenu`, or `ContextMenu` to label related items (File, Edit, View, etc.).

## When not to use it

- For a top-level menu, use `Menu`.
- For a single menu item, use `MenuItem`.

## Props

- `class` — string, default `""`.
- `label` — string, **required**. Heading text, also used as `aria-label`.
- `children` — `Snippet`, optional. Menu items.

## Usage

```svelte
<script lang="ts">
  import MenuGroup from './MenuGroup.svelte';
</script>

<MenuGroup label="File">
  <ul role="menu">
    <li role="menuitem">Open…</li>
    <li role="menuitem">Save</li>
  </ul>
</MenuGroup>
```

## Accessibility

- `role="group"` lets AT identify the section as a coherent block.
- Heading is hidden from AT (`aria-hidden="true"`) because `aria-label` on the group already announces it.

## Related components

- `Menu` — top-level menu.
- `MenuItem` — single menu item.
- `DropdownMenu` — menu opened from a trigger button.

## References

- Adobe Spectrum Menu: https://spectrum.adobe.com/page/menu/
- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
