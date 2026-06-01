# PortugalPassaporteInput

A headless input for Portugal's Passaporte. Format: 1 letter [A-Z] and 6 digits [0-9].

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="portugal-passaporte-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Portugal Passaporte.
- Administrative, clinical, or passport workflows.

## When not to use it

- For read-only display, use `PortugalPassaporteView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.portugal-passaporte-input`.

## References

- https://en.wikipedia.org/wiki/Portuguese_passport
