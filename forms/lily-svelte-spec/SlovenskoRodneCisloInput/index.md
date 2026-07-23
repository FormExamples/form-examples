# SlovenskoRodneCisloInput

A headless input for Slovakia's Rodné číslo (RČ). Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="slovensko-rodne-cislo-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Slovakia Rodné číslo.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `SlovenskoRodneCisloView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.slovensko-rodne-cislo-input`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Slovakia

---

Lily™ and Lily Design System™ are trademarks.
