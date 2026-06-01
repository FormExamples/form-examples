# TransferList

A dual list box for moving items between two lists. This headless Svelte component renders a `role="group"` container with two `<section>`s (source and target) and an optional action region between them.

## What it is

A headless Svelte 5 component inspired by [Ant Design Transfer](https://ant.design/components/transfer). Consumers fill each region with a Listbox or similar selectable list. Category: form controls.

## What it does

- Renders a `<div class="transfer-list" role="group" aria-label={label}>`.
- Renders `<section class="transfer-list-source" aria-label={sourceLabel}>` and `<section class="transfer-list-target" aria-label={targetLabel}>`.
- Renders an optional `<div class="transfer-list-actions">` between them when an `actions` snippet is provided.

## When to use it

- Multi-select pickers where users move items between "available" and "selected" lists.
- Permission and role assignment screens.

## When not to use it

- For single-select dropdowns, use `Select` or `Combobox`.
- For tag-style multi-select, use `TagInput`.

## Props

- `class` — string, default `""`. CSS class appended to `transfer-list`.
- `label` — string, **required**. Group accessible name via `aria-label`.
- `sourceLabel` — string, **required**. Source list heading.
- `targetLabel` — string, **required**. Target list heading.
- `source` — `Snippet`, **required**. Source list content.
- `target` — `Snippet`, **required**. Target list content.
- `actions` — `Snippet`, optional. Action buttons between the two lists.
- `...restProps` — additional HTML attributes spread onto the root `<div>`.

## Usage

```svelte
<script lang="ts">
  import TransferList from './TransferList.svelte';
</script>

<TransferList label="Roles" sourceLabel="Available" targetLabel="Selected">
  {#snippet source()}
    <ul role="listbox" aria-label="Available">…</ul>
  {/snippet}
  {#snippet actions()}
    <button type="button" aria-label="Move right">→</button>
    <button type="button" aria-label="Move left">←</button>
  {/snippet}
  {#snippet target()}
    <ul role="listbox" aria-label="Selected">…</ul>
  {/snippet}
</TransferList>
```

## Accessibility

- `role="group"` on the container with `aria-label={label}`.
- Each list region is a `<section>` with `aria-label`, providing a separate landmark.
- Action buttons should have accessible labels (icons need `aria-label`).

## Related components

- `Listbox` — selectable list often placed in source/target.
- `TagInput` — keyword-style multi-select.
- `CheckboxGroup` — flat multi-select.

## References

- Ant Design Transfer: https://ant.design/components/transfer
- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
