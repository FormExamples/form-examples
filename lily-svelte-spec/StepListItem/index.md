# StepListItem

One step in a step list with a status of waiting, in-progress, finished, or error. This headless Svelte component renders a semantic `<li>` with `data-status` and `aria-current` when active.

## What it is

A headless Svelte 5 component, paired with `StepList`. Inspired by [Ant Design Steps](https://ant.design/components/steps). Category: navigation / progress indicators.

## What it does

- Renders an `<li class="step-list-item">` with consumer `class` appended.
- Applies `data-status` (one of `waiting`, `in-progress`, `finished`, `error`).
- Applies `aria-current="step"` when `current=true`.
- Applies `aria-label` when the override is provided.

## When to use it

- Inside `StepList` to represent each step in a multi-step process.

## When not to use it

- Outside a `StepList`; use `<li>` or `TimelineListItem` directly.

## Props

- `class` — string, default `""`. CSS class appended to `step-list-item`.
- `status` — `"waiting" | "in-progress" | "finished" | "error"`, default `"waiting"`.
- `current` — boolean, default `false`. When true, sets `aria-current="step"`.
- `label` — string, optional. `aria-label` override.
- `children` — `Snippet`, required. Step content (title and optional description).
- `...restProps` — additional HTML attributes spread onto the `<li>`.

## Usage

```svelte
<script lang="ts">
  import StepList from '../StepList/StepList.svelte';
  import StepListItem from './StepListItem.svelte';
</script>

<StepList label="Checkout" current={1}>
  <StepListItem status="finished">Cart</StepListItem>
  <StepListItem status="in-progress" current label="Step 2 of 3: Shipping">
    Shipping
  </StepListItem>
  <StepListItem status="waiting">Payment</StepListItem>
</StepList>
```

## Accessibility

- `aria-current="step"` is announced as "current step" by most screen readers.
- Use `data-status` to drive consumer CSS for visual state.
- Provide `label` overrides to give richer announcements (e.g., "Step 2 of 3: Shipping").

## Related components

- `StepList` — the ordered list wrapper.
- `TimelineListItem` — one event in a timeline.

## References

- Ant Design Steps: https://ant.design/components/steps
