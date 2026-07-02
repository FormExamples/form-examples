# SlovenskoPasInput

A headless input for Slovakia's Pas. Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="slovensko-pas-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Slovakia Pas.
- Administrative, clinical, or passport workflows.

## When not to use it

- For read-only display, use `SlovenskoPasView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.slovensko-pas-input`.

## References

- https://en.wikipedia.org/wiki/Slovak_passport
