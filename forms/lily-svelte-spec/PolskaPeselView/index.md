# PolskaPeselView

A headless read-only display for Poland's PESEL. Format: 11 numeric digits; assigned shortly after birth and unchanged for life.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="polska-pesel-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Poland PESEL read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `PolskaPeselInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.polska-pesel-view`.

## References

- https://en.wikipedia.org/wiki/PESEL
