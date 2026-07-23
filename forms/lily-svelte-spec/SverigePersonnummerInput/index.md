# SverigePersonnummerInput

A headless input for Sweden's Personnummer. Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="sverige-personnummer-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Sweden Personnummer.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `SverigePersonnummerView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.sverige-personnummer-input`.

## References

- https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)

---

Lily™ and Lily Design System™ are trademarks.
