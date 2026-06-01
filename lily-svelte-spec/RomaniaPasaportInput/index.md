# RomaniaPasaportInput

A headless input for Romania's Paşaport. Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9].

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="romania-pasaport-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Romania Paşaport.
- Administrative, clinical, or passport workflows.

## When not to use it

- For read-only display, use `RomaniaPasaportView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.romania-pasaport-input`.

## References

- https://en.wikipedia.org/wiki/Romanian_passport
