# HrvatskaOsobniIdentifikacijskiBrojInput

A headless input for Croatia's Osobni identifikacijski broj (OIB). Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="hrvatska-osobni-identifikacijski-broj-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Croatia Osobni identifikacijski broj.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `HrvatskaOsobniIdentifikacijskiBrojView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.hrvatska-osobni-identifikacijski-broj-input`.

## References

- https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)

---

Lily™ and Lily Design System™ are trademarks.
