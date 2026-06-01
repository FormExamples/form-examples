# LatvijaPersonasKodsView

A headless read-only display for Latvia's Personas kods. Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="latvija-personas-kods-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Latvia Personas kods read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `LatvijaPersonasKodsInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.latvija-personas-kods-view`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Latvia
