# LiechtensteinNationalIdentityCardNumberInput

A headless input for Liechtenstein's Liechtenstein National Identity Card Number. Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="liechtenstein-national-identity-card-number-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Liechtenstein Liechtenstein National Identity Card Number.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `LiechtensteinNationalIdentityCardNumberView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.liechtenstein-national-identity-card-number-input`.

## References

- https://en.wikipedia.org/wiki/National_identity_card

---

Lily™ and Lily Design System™ are trademarks.
