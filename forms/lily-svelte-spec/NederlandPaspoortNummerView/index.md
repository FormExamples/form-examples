# NederlandPaspoortNummerView

A headless read-only display for Netherlands's Paspoort Nummer. Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9].

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="nederland-paspoort-nummer-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Netherlands Paspoort Nummer read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `NederlandPaspoortNummerInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.nederland-paspoort-nummer-view`.

## References

- https://en.wikipedia.org/wiki/Dutch_passport

---

Lily™ and Lily Design System™ are trademarks.
