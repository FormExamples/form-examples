# NederlandBurgerserviceNummerInput

A headless input for Netherlands's Burgerservicenummer (BSN). Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="nederland-burgerservice-nummer-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Netherlands Burgerservicenummer.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `NederlandBurgerserviceNummerView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.nederland-burgerservice-nummer-input`.

## References

- https://en.wikipedia.org/wiki/Burgerservicenummer

---

Lily™ and Lily Design System™ are trademarks.
