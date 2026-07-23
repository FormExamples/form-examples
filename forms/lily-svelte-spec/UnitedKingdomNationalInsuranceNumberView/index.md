# UnitedKingdomNationalInsuranceNumberView

A headless read-only display for United Kingdom's National Insurance Number (NINO). Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="united-kingdom-national-insurance-number-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored United Kingdom National Insurance Number read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `UnitedKingdomNationalInsuranceNumberInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.united-kingdom-national-insurance-number-view`.

## References

- https://en.wikipedia.org/wiki/National_Insurance_number

---

Lily™ and Lily Design System™ are trademarks.
