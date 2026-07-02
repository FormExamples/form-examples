# TreeSelect

A select dropdown showing a tree of hierarchical options. This headless Svelte component renders a `role="combobox"` container with a trigger button and a tree panel.

## What it is

A headless Svelte 5 component inspired by [Ant Design TreeSelect](https://ant.design/components/tree-select). Consumers manage expansion and selection state. Category: form controls.

## What it does

- Renders a `<div role="combobox" aria-haspopup="tree">` with the base class `tree-select` plus consumer `class`.
- Sets `aria-expanded`, `aria-label`, and (when `multiple`) `aria-multiselectable="true"`.
- Renders a child `<button class="tree-select-trigger" type="button">` with the current `value` or `placeholder`.
- Renders a `<div class="tree-select-panel">` hidden when not expanded.

## When to use it

- Selecting from a hierarchy (categories, organizational units) where the visible label can show the path.
- Multi-selecting nested items.

## When not to use it

- For a flat dropdown, use `Select` or `Combobox`.
- For path picking that always shows each level, use `Cascader`.

## Props

- `class` — string, default `""`. CSS class appended to `tree-select`.
- `label` — string, **required**. Accessible name via `aria-label`.
- `expanded` — boolean, default `false`. Whether the tree panel is open.
- `disabled` — boolean, default `false`. Disables the trigger button.
- `multiple` — boolean, default `false`. Sets `aria-multiselectable="true"` when true.
- `placeholder` — string, optional.
- `value` — string, optional. Display value.
- `onclick` — `(event: MouseEvent) => void`, optional. Trigger click handler.
- `children` — `Snippet`, optional. Tree content (typically `TreeNav`/`TreeList`).
- `...restProps` — additional HTML attributes spread onto the root `<div>`.

## Usage

```svelte
<script lang="ts">
  import TreeSelect from './TreeSelect.svelte';

  let open = $state(false);
  let value = $state('');
</script>

<TreeSelect
  label="Category"
  placeholder="Choose a category"
  expanded={open}
  value={value}
  multiple
  onclick={() => (open = !open)}
>
  <ul role="tree" aria-label="Categories">…</ul>
</TreeSelect>
```

## Accessibility

- `role="combobox"` with `aria-haspopup="tree"`, `aria-expanded`, and `aria-label`.
- `aria-multiselectable` set only when `multiple=true`.
- Native `<button>` trigger handles Tab/Enter/Space.

## Related components

- `Cascader` — multi-level dropdown that emphasizes the path.
- `Select` — flat single-select.
- `Combobox` — text input with filtering.

## References

- Ant Design TreeSelect: https://ant.design/components/tree-select
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
