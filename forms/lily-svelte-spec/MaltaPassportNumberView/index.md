# MaltaPassportNumberView

A headless read-only display for Malta's Malta Passport Number. Format: 7 numerical digits issued by the Civil Registration Directorate.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="malta-passport-number-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Malta Malta Passport Number read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `MaltaPassportNumberInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.malta-passport-number-view`.

## References

- https://en.wikipedia.org/wiki/Maltese_passport

---

Lily™ and Lily Design System™ are trademarks.
