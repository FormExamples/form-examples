# LiechtensteinPassportNumberInput

A headless input for Liechtenstein's Liechtenstein Passport Number. Format: 1 letter followed by 5 digits (e.g. R00536).

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="liechtenstein-passport-number-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Liechtenstein Liechtenstein Passport Number.
- Administrative, clinical, or passport workflows.

## When not to use it

- For read-only display, use `LiechtensteinPassportNumberView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.liechtenstein-passport-number-input`.

## References

- https://en.wikipedia.org/wiki/Liechtenstein_passport
