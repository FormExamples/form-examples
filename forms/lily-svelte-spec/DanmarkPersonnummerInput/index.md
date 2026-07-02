# DanmarkPersonnummerInput

A headless input for Denmark's Personnummer (CPR-nummer) (CPR). Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY).

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="danmark-personnummer-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Denmark Personnummer (CPR-nummer).
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `DanmarkPersonnummerView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.danmark-personnummer-input`.

## References

- https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)
