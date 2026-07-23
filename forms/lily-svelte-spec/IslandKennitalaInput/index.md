# IslandKennitalaInput

A headless input for Iceland's Kennitala. Format: 10 digits where the first 6 are the date of birth (DDMMYY).

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="island-kennitala-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Iceland Kennitala.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `IslandKennitalaView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.island-kennitala-input`.

## References

- https://en.wikipedia.org/wiki/Kennitala

---

Lily™ and Lily Design System™ are trademarks.
