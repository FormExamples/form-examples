# ValidationList

A live-feedback list of input validation rules with pending, passed, and failed states. This headless Svelte component renders a `<ul>` with `aria-live="polite"` so status changes on items are announced.

## What it is

A headless Svelte 5 component inspired by the U.S. Web Design System (USWDS) Validation pattern. Category: forms / feedback.

## What it does

- Renders a `<ul>` with the base class `validation-list` plus consumer `class`.
- Applies the **required** `aria-label`.
- Applies `aria-live="polite"` so descendant status changes are announced unobtrusively.
- Spreads `...restProps` onto the `<ul>`.

## When to use it

- Live password requirement checklists.
- Inline rule feedback for fields where multiple constraints must pass.

## When not to use it

- For a one-shot error summary, use `ErrorSummary`.
- For a single error message tied to a field, use `ErrorMessage`.

## Props

- `class` — string, default `""`. CSS class appended to `validation-list`.
- `label` — string, **required**. `aria-label` naming the list.
- `children` — `Snippet`, required. Validation list item children.
- `...restProps` — additional HTML attributes spread onto the `<ul>`.

## Usage

```svelte
<script lang="ts">
  import ValidationList from './ValidationList.svelte';
  import ValidationListItem from '../ValidationListItem/ValidationListItem.svelte';
</script>

<ValidationList label="Password requirements">
  <ValidationListItem status="passed">At least 8 characters</ValidationListItem>
  <ValidationListItem status="pending">One uppercase letter</ValidationListItem>
  <ValidationListItem status="failed">One number</ValidationListItem>
</ValidationList>
```

## Accessibility

- `aria-live="polite"` causes screen readers to announce changes when items toggle status.
- `aria-label` names the list (typically the related field).

## Related components

- `ValidationListItem` — one rule with a status.
- `ErrorMessage` — single field error.
- `ErrorSummary` — top-of-form error list.

## References

- USWDS Validation: https://designsystem.digital.gov/components/validation/
- WAI-ARIA aria-live: https://www.w3.org/TR/wai-aria-1.2/#aria-live
