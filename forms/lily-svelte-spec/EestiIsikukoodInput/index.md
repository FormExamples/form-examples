# EestiIsikukoodInput

A headless input for Estonia's Isikukood (IK). Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="eesti-isikukood-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Estonia Isikukood.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `EestiIsikukoodView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.eesti-isikukood-input`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Estonia

---

Lily™ and Lily Design System™ are trademarks.
