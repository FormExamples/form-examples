# UnitedKingdomNationalInsuranceNumberInput

A headless input for United Kingdom's National Insurance Number (NINO). Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="united-kingdom-national-insurance-number-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a United Kingdom National Insurance Number.
- Administrative, clinical, or tax/welfare workflows.

## When not to use it

- For read-only display, use `UnitedKingdomNationalInsuranceNumberView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.united-kingdom-national-insurance-number-input`.

## References

- https://en.wikipedia.org/wiki/National_Insurance_number

---

Lily™ and Lily Design System™ are trademarks.
