# NederlandPaspoortNummerInput

A headless input for Netherlands's Paspoort Nummer. Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9].

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="nederland-paspoort-nummer-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Netherlands Paspoort Nummer.
- Administrative, clinical, or passport workflows.

## When not to use it

- For read-only display, use `NederlandPaspoortNummerView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.nederland-paspoort-nummer-input`.

## References

- https://en.wikipedia.org/wiki/Dutch_passport
