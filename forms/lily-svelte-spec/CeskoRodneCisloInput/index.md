# CeskoRodneCisloInput

A headless input for Czech Republic's Rodné číslo (RČ). Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="cesko-rodne-cislo-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Czech Republic Rodné číslo.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `CeskoRodneCisloView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.cesko-rodne-cislo-input`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic

---

Lily™ and Lily Design System™ are trademarks.
