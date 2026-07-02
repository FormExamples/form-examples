# PolskaPeselInput

A headless input for Poland's PESEL. Format: 11 numeric digits; assigned shortly after birth and unchanged for life.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="polska-pesel-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Poland PESEL.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `PolskaPeselView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.polska-pesel-input`.

## References

- https://en.wikipedia.org/wiki/PESEL
