# LietuvaPasasView

A headless read-only display for Lithuania's Pasas. Format: 8-digit passport or identity card number.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="lietuva-pasas-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Lithuania Pasas read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `LietuvaPasasInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.lietuva-pasas-view`.

## References

- https://en.wikipedia.org/wiki/Lithuanian_passport

---

Lily™ and Lily Design System™ are trademarks.
