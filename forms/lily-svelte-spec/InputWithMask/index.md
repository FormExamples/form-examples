# InputWithMask

An input that displays a format mask placeholder for the user to fill in. This headless Svelte component renders a `<div>` wrapper containing a decorative mask span and an `<input type="text">`.

## What it is

A headless Svelte 5 component inspired by the U.S. Web Design System (USWDS) Input mask pattern. Category: form controls.

## What it does

- Renders a `<div>` with the base class `input-with-mask` plus consumer `class`, and a `data-mask` attribute carrying the mask string.
- Renders `<span class="input-with-mask-display" aria-hidden="true">{mask}</span>` so the mask is visually present but not announced.
- Renders `<input class="input-with-mask-control" type="text">` with the **required** `aria-label`.
- Forwards `value`, `placeholder`, `disabled`, and `oninput` to the input.
- Spreads `...restProps` onto the wrapper `<div>`.

## When to use it

- Phone, date, ZIP, SSN, or other format-specific inputs where a visible mask helps users fill in the value.

## When not to use it

- For free-form text, use `TextInput`.
- For dates, prefer `DateInput` or `DateField`.

## Props

- `class` — string, default `""`. CSS class appended to `input-with-mask`.
- `label` — string, **required**. `aria-label` on the input.
- `mask` — string, **required**. Format mask placeholder string.
- `value` — string, default `""`. Input value.
- `placeholder` — string, optional. HTML placeholder.
- `disabled` — boolean, default `false`.
- `oninput` — `(event: Event) => void`, optional.
- `...restProps` — additional HTML attributes spread onto the wrapper `<div>`.

## Usage

```svelte
<script lang="ts">
  import InputWithMask from './InputWithMask.svelte';

  let phone = $state('');
</script>

<InputWithMask
  label="Phone number"
  mask="(___) ___-____"
  value={phone}
  oninput={(e) => (phone = (e.target as HTMLInputElement).value)}
/>
```

## Accessibility

- The mask span is decorative (`aria-hidden="true"`); the accessible name comes from the input's `aria-label`.
- Consumers may layer the mask visually behind the input via CSS using `data-mask` or `.input-with-mask-display`.

## Related components

- `TextInput` — plain text input.
- `DateField` — structured date entry.

## References

- USWDS Input mask: https://designsystem.digital.gov/components/input-mask/
