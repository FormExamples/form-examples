# MaltaNationalIdentificationNumberInput

A headless input for Malta's Malta National Identification Number. Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="malta-national-identification-number-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Malta Malta National Identification Number.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `MaltaNationalIdentificationNumberView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.malta-national-identification-number-input`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Malta
