# ButtonGroup

A wrapper that groups related buttons together as a single accessible group. This headless Svelte component renders a `<div>` with `role="group"` and a required `aria-label`.

## What it is

A headless Svelte 5 component that exposes a grouping landmark for assistive technology. Inspired by the U.S. Web Design System (USWDS) button group pattern. Category: layout / interaction primitives.

## What it does

- Renders a `<div>` with the base class `button-group` plus consumer `class`.
- Adds `role="group"` and the **required** `aria-label`.
- Renders children unchanged so each button keeps its own behavior, focus, and keyboard support.
- Spreads `...restProps` onto the root `<div>`.

## When to use it

- A toolbar of related actions (e.g., Save / Cancel).
- A pair of paginate buttons (Previous / Next).
- A segmented set of buttons that act on the same target.

## When not to use it

- For mutually exclusive options, use `SegmentGroup` (radio-style).
- For a single primary action with a dropdown, use `SplitButton`.
- For a vertical list of menu actions, use `Menu`.

## Props

- `class` — string, default `""`. CSS class appended to `button-group`.
- `label` — string, **required**. Accessible name applied as `aria-label`.
- `children` — `Snippet`, required. Grouped buttons.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import ButtonGroup from './ButtonGroup.svelte';
</script>

<ButtonGroup label="Edit actions">
  <button type="button">Save</button>
  <button type="button">Cancel</button>
</ButtonGroup>
```

## Accessibility

- The group exposes `role="group"` so assistive technology announces the cluster of buttons as one unit.
- `aria-label` is required and provides the group's name.
- Children remain independent interactive elements with their own focus, keyboard, and click semantics.

## Related components

- `SegmentGroup` — mutually exclusive segments.
- `ToggleGroup` — multi-select toggle buttons.
- `ToolBar` — full toolbar with multiple groups.

## References

- USWDS Button group: https://designsystem.digital.gov/components/button-group/
- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
