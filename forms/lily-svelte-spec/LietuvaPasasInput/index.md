# LietuvaPasasInput

A headless input for Lithuania's Pasas. Format: 8-digit passport or identity card number.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="lietuva-pasas-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Lithuania Pasas.
- Administrative, clinical, or passport workflows.

## When not to use it

- For read-only display, use `LietuvaPasasView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.lietuva-pasas-input`.

## References

- https://en.wikipedia.org/wiki/Lithuanian_passport
