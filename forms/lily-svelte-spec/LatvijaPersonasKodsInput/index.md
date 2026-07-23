# LatvijaPersonasKodsInput

A headless input for Latvia's Personas kods. Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="latvija-personas-kods-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Latvia Personas kods.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `LatvijaPersonasKodsView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.latvija-personas-kods-input`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Latvia

---

Lily™ and Lily Design System™ are trademarks.
