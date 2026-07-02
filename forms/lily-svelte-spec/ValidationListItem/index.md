# ValidationListItem

One validation rule in a `ValidationList`, with a status of pending, passed, or failed. This headless Svelte component renders an `<li>` with a `data-status` attribute.

## What it is

A headless Svelte 5 component inspired by the U.S. Web Design System (USWDS) Validation pattern. Category: forms / feedback.

## What it does

- Renders an `<li>` with the base class `validation-list-item` plus consumer `class`.
- Renders `data-status` of `pending`, `passed`, or `failed` (default: `pending`).
- Optionally applies `aria-label` to override the accessible name.
- Renders rule text from `children`.
- Spreads `...restProps` onto the `<li>`.

## When to use it

- Inside `ValidationList` for a single password requirement, schema rule, or constraint.

## When not to use it

- For a single error message tied to a field, use `ErrorMessage`.
- For a top-of-form summary, use `ErrorSummary`.

## Props

- `class` — string, default `""`. CSS class appended to `validation-list-item`.
- `status` — `"pending" | "passed" | "failed"`, default `"pending"`. Sets `data-status`.
- `label` — string, optional. `aria-label` override.
- `children` — `Snippet`, required. Rule text content.
- `...restProps` — additional HTML attributes spread onto the `<li>`.

## Usage

```svelte
<script lang="ts">
  import ValidationList from '../ValidationList/ValidationList.svelte';
  import ValidationListItem from './ValidationListItem.svelte';
</script>

<ValidationList label="Password requirements">
  <ValidationListItem status="passed">At least 8 characters</ValidationListItem>
  <ValidationListItem status="pending">One uppercase letter</ValidationListItem>
  <ValidationListItem status="failed">One number</ValidationListItem>
</ValidationList>
```

## Accessibility

- The parent `ValidationList` provides `aria-live="polite"`; status changes on this item are announced when its text or status changes.
- Convey status meaningfully through the rule text itself, since `data-status` is for styling only.

## Related components

- `ValidationList` — the parent live-feedback list.
- `ErrorMessage` — single field error message.
- `ErrorSummary` — page-level error summary.

## References

- USWDS Validation: https://designsystem.digital.gov/components/validation/
