# LiechtensteinNationalIdentityCardNumberView

A headless read-only display for Liechtenstein's Liechtenstein National Identity Card Number. Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="liechtenstein-national-identity-card-number-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Liechtenstein Liechtenstein National Identity Card Number read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `LiechtensteinNationalIdentityCardNumberInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.liechtenstein-national-identity-card-number-view`.

## References

- https://en.wikipedia.org/wiki/National_identity_card

---

Lily™ and Lily Design System™ are trademarks.
