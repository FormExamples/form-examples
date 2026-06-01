# StepList

An ordered list of step items showing progress through a multi-step process. This headless Svelte component renders a semantic `<ol>` with optional aria-label and a `data-current` hook.

## What it is

A headless Svelte 5 component inspired by [Ant Design Steps](https://ant.design/components/steps). Pair with `StepListItem` for each step. Category: navigation / progress indicators.

## What it does

- Renders an `<ol class="step-list">` with consumer `class` appended.
- Applies optional `aria-label`.
- Applies optional `data-current` (0-based index) for consumer CSS hooks.

## When to use it

- Multi-step forms, wizards, or onboarding flows.
- Order checkout or progress through a process.

## When not to use it

- For unordered navigation, use `Menu`, `NavigationMenu`, or `BreadcrumbNav`.
- For paginated content, use `PaginationNav`.

## Props

- `class` — string, default `""`. CSS class appended to `step-list`.
- `label` — string, optional. `aria-label` for the list.
- `current` — number, optional. 0-based index of the current step (data hook).
- `children` — `Snippet`, required. `StepListItem` children.
- `...restProps` — additional HTML attributes spread onto the `<ol>`.

## Usage

```svelte
<script lang="ts">
  import StepList from './StepList.svelte';
  import StepListItem from '../StepListItem/StepListItem.svelte';
</script>

<StepList label="Checkout" current={1}>
  <StepListItem status="finished">Cart</StepListItem>
  <StepListItem status="in-progress" current>Shipping</StepListItem>
  <StepListItem status="waiting">Payment</StepListItem>
</StepList>
```

## Accessibility

- The `<ol>` provides list semantics; screen readers announce the count.
- Use `aria-label` (or `aria-labelledby`) so the list has an accessible name.

## Related components

- `StepListItem` — one step in the list.
- `TimelineList` — chronological events.
- `BreadcrumbNav` — navigation path.

## References

- Ant Design Steps: https://ant.design/components/steps
