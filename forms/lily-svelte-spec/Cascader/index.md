# Cascader

A multi-level dropdown for selecting a value from a hierarchy. This headless Svelte component renders a combobox container with a trigger button and a panel that consumers fill with nested option lists.

## What it is

A headless Svelte 5 component inspired by [Ant Design Cascader](https://ant.design/components/cascader). Consumers manage `expanded` state and selection separately so the component remains pure structural markup. Category: form controls.

## What it does

- Renders a `<div role="combobox">` with the base class `cascader` plus consumer `class`.
- Applies `aria-haspopup="tree"`, `aria-expanded`, and `aria-label`.
- Renders a child trigger `<button class="cascader-trigger" type="button">` showing the current `value` or `placeholder`.
- Renders a panel `<div class="cascader-panel">` with the `hidden` attribute toggled by `expanded`.

## When to use it

- Selecting a value from a deep hierarchy (e.g., country → state → city, category trees).
- When showing the path of selected values is important.

## When not to use it

- For a flat list of options, use `Select` or `Combobox`.
- For multi-select within a single tree, use `TreeSelect`.

## Props

- `class` — string, default `""`. CSS class appended to `cascader`.
- `label` — string, **required**. Accessible name via `aria-label`.
- `expanded` — boolean, default `false`. Whether the panel is open.
- `disabled` — boolean, default `false`. Disables the trigger button.
- `placeholder` — string, optional. Placeholder text on the trigger when no value is selected.
- `value` — string, optional. Display value (consumer formats the path).
- `onclick` — `(event: MouseEvent) => void`, optional. Trigger click handler.
- `children` — `Snippet`, optional. Panel content (typically nested option lists).
- `...restProps` — additional HTML attributes spread onto the root `<div>`.

## Usage

```svelte
<script lang="ts">
  import Cascader from './Cascader.svelte';

  let open = $state(false);
  let value = $state('');
</script>

<Cascader
  label="Region"
  placeholder="Choose a region"
  expanded={open}
  value={value}
  onclick={() => (open = !open)}
>
  <ul role="tree" aria-label="Regions">…</ul>
</Cascader>
```

## Accessibility

- `role="combobox"` with `aria-haspopup="tree"`, `aria-expanded`, and `aria-label`.
- Trigger is a native `<button>`, so Tab focuses it and Enter/Space activate it.
- Consumers should manage focus into the panel when it expands.

## Related components

- `Select` — flat list dropdown.
- `Combobox` — text input with filterable list.
- `TreeSelect` — combobox showing a tree of options with optional multi-select.
- `DropdownMenu` — generic dropdown for actions.

## References

- Ant Design Cascader: https://ant.design/components/cascader
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
