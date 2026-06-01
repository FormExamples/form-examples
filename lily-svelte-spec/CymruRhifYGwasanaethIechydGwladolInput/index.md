# CymruRhifYGwasanaethIechydGwladolInput

A headless input for Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG). Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man).

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Wales Rhif y Gwasanaeth Iechyd Gwladol.
- Administrative, clinical, or healthcare workflows.

## When not to use it

- For read-only display, use `CymruRhifYGwasanaethIechydGwladolView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.cymru-rhif-y-gwasanaeth-iechyd-gwladol-input`.

## References

- https://en.wikipedia.org/wiki/NHS_number
