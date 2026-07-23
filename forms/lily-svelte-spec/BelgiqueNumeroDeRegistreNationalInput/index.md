# BelgiqueNumeroDeRegistreNationalInput

A headless input for Belgium's Numéro de Registre National / Rijksregisternummer (NRN). Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="belgique-numero-de-registre-national-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Belgium Numéro de Registre National / Rijksregisternummer.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `BelgiqueNumeroDeRegistreNationalView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.belgique-numero-de-registre-national-input`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Belgium

---

Lily™ and Lily Design System™ are trademarks.
