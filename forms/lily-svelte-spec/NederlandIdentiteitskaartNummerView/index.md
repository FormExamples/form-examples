# NederlandIdentiteitskaartNummerView

A headless read-only display for Netherlands's Identiteitskaart Nummer. Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="nederland-identiteitskaart-nummer-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Netherlands Identiteitskaart Nummer read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `NederlandIdentiteitskaartNummerInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.nederland-identiteitskaart-nummer-view`.

## References

- https://en.wikipedia.org/wiki/Dutch_identity_card

---

Lily™ and Lily Design System™ are trademarks.
