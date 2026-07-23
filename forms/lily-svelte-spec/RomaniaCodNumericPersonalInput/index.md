# RomaniaCodNumericPersonalInput

A headless input for Romania's Cod Numeric Personal (CNP). Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="romania-cod-numeric-personal-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Romania Cod Numeric Personal.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `RomaniaCodNumericPersonalView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.romania-cod-numeric-personal-input`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Romania

---

Lily™ and Lily Design System™ are trademarks.
