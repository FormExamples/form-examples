# MaltaPassportNumberInput

A headless input for Malta's Malta Passport Number. Format: 7 numerical digits issued by the Civil Registration Directorate.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="malta-passport-number-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Malta Malta Passport Number.
- Administrative, clinical, or passport workflows.

## When not to use it

- For read-only display, use `MaltaPassportNumberView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.malta-passport-number-input`.

## References

- https://en.wikipedia.org/wiki/Maltese_passport

---

Lily™ and Lily Design System™ are trademarks.
