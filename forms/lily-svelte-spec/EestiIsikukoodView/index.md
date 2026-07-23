# EestiIsikukoodView

A headless read-only display for Estonia's Isikukood (IK). Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="eesti-isikukood-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Estonia Isikukood read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `EestiIsikukoodInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.eesti-isikukood-view`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Estonia

---

Lily™ and Lily Design System™ are trademarks.
