# EnglandNationalHealthServiceNumberView

A headless read-only display for England's National Health Service Number (NHS). Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="england-national-health-service-number-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored England National Health Service Number read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `EnglandNationalHealthServiceNumberInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.england-national-health-service-number-view`.

## References

- https://en.wikipedia.org/wiki/NHS_number
