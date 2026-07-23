# DeutschlandKrankenversichertennummerInput

A headless input for Germany's Krankenversichertennummer (KVNR). Format: a random capital letter followed by eight random digits and a Luhn check digit.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="deutschland-krankenversichertennummer-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Germany Krankenversichertennummer.
- Administrative, clinical, or healthcare workflows.

## When not to use it

- For read-only display, use `DeutschlandKrankenversichertennummerView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.deutschland-krankenversichertennummer-input`.

## References

- https://de.wikipedia.org/wiki/Krankenversichertennummer

---

Lily™ and Lily Design System™ are trademarks.
