# LietuvaAsmensKodasInput

A headless input for Lithuania's Asmens kodas. Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="lietuva-asmens-kodas-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Lithuania Asmens kodas.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `LietuvaAsmensKodasView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.lietuva-asmens-kodas-input`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Lithuania

---

Lily™ and Lily Design System™ are trademarks.
