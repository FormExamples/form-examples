# SlovenijaEmsoInput

A headless input for Slovenia's Enotna Matična Številka Občana (EMŠO). Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="slovenija-emso-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Slovenia Enotna Matična Številka Občana.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `SlovenijaEmsoView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.slovenija-emso-input`.

## References

- https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number
