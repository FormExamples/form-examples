# SlovenijaEmsoView

A headless read-only display for Slovenia's Enotna Matična Številka Občana (EMŠO). Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="slovenija-emso-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Slovenia Enotna Matična Številka Občana read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `SlovenijaEmsoInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.slovenija-emso-view`.

## References

- https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number

---

Lily™ and Lily Design System™ are trademarks.
