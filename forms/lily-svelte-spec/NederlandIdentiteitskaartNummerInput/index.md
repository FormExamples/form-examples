# NederlandIdentiteitskaartNummerInput

A headless input for Netherlands's Identiteitskaart Nummer. Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="nederland-identiteitskaart-nummer-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Netherlands Identiteitskaart Nummer.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `NederlandIdentiteitskaartNummerView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.nederland-identiteitskaart-nummer-input`.

## References

- https://en.wikipedia.org/wiki/Dutch_identity_card

---

Lily™ and Lily Design System™ are trademarks.
