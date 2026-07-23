# IslandKennitalaView

A headless read-only display for Iceland's Kennitala. Format: 10 digits where the first 6 are the date of birth (DDMMYY).

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="island-kennitala-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Iceland Kennitala read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `IslandKennitalaInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.island-kennitala-view`.

## References

- https://en.wikipedia.org/wiki/Kennitala

---

Lily™ and Lily Design System™ are trademarks.
