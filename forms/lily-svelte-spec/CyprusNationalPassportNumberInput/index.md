# CyprusNationalPassportNumberInput

A headless input for Cyprus's National Passport Number. Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678).

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="cyprus-national-passport-number-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Cyprus National Passport Number.
- Administrative, clinical, or passport workflows.

## When not to use it

- For read-only display, use `CyprusNationalPassportNumberView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.cyprus-national-passport-number-input`.

## References

- https://en.wikipedia.org/wiki/Cypriot_passport

---

Lily™ and Lily Design System™ are trademarks.
