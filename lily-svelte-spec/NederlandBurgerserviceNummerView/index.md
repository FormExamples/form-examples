# NederlandBurgerserviceNummerView

A headless read-only display for Netherlands's Burgerservicenummer (BSN). Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="nederland-burgerservice-nummer-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Netherlands Burgerservicenummer read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `NederlandBurgerserviceNummerInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.nederland-burgerservice-nummer-view`.

## References

- https://en.wikipedia.org/wiki/Burgerservicenummer
