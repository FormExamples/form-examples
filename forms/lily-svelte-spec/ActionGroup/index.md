# ActionGroup

A group of action buttons that can collapse to an overflow menu when space is constrained.

## What it is

A headless Svelte 5 component that renders a `<div role="group">` with an `aria-label`, plus an optional overflow trigger and overflow menu container. Inspired by Adobe Spectrum's ActionGroup.

## What it does

- Renders the visible buttons via `children`.
- When the named `overflow` snippet is provided, also renders an overflow trigger `<button>` (with `aria-haspopup="menu"`, `aria-expanded`, and `aria-label`) and a `<div class="action-group-overflow-menu">` that is `hidden` when `overflowOpen` is false.
- Calls `onOverflowToggle` when the trigger is clicked.

## When to use it

- A horizontal cluster of related actions where some may need to collapse on narrow viewports.

## When not to use it

- For a contextual selection bar, use `ActionBar`.
- For a permanent toolbar, use `ToolBar`.
- For a button group without overflow, use `ButtonGroup`.

## Props

- `class` — string, default `""`.
- `label` — string, **required**. `aria-label` for the group.
- `overflowOpen` — boolean, default `false`.
- `overflowLabel` — string, optional. `aria-label` for the overflow trigger.
- `onOverflowToggle` — `() => void`, optional.
- `children` — `Snippet`, optional. Visible action buttons.
- `overflow` — `Snippet`, optional. Overflow menu content.

## Usage

```svelte
<script lang="ts">
  import ActionGroup from './ActionGroup.svelte';

  let open = $state(false);
</script>

<ActionGroup
  label="Editing actions"
  overflowOpen={open}
  overflowLabel="More actions"
  onOverflowToggle={() => (open = !open)}
>
  <button type="button">Cut</button>
  <button type="button">Copy</button>
  <button type="button">Paste</button>

  {#snippet overflow()}
    <ul role="menu">
      <li role="menuitem"><button>Find</button></li>
      <li role="menuitem"><button>Replace</button></li>
    </ul>
  {/snippet}
</ActionGroup>
```

## Accessibility

- `role="group"` with `aria-label` describes the action cluster.
- Overflow trigger uses `aria-haspopup="menu"` and `aria-expanded` per WAI-ARIA Button + Menu patterns.
- The overflow menu uses the native `hidden` attribute, so it is removed from the accessibility tree when closed.

## Related components

- `ActionBar` — contextual selection toolbar.
- `ButtonGroup` — simple button cluster (no overflow).
- `Menu` — full menu component.
- `ToolBar` — permanent toolbar.

## References

- Adobe Spectrum ActionGroup: https://spectrum.adobe.com/page/action-group/
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
