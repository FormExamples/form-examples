# CymruRhifYGwasanaethIechydGwladolView

A headless read-only display for Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG). Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man).

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Wales Rhif y Gwasanaeth Iechyd Gwladol read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `CymruRhifYGwasanaethIechydGwladolInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.cymru-rhif-y-gwasanaeth-iechyd-gwladol-view`.

## References

- https://en.wikipedia.org/wiki/NHS_number

---

Lily™ and Lily Design System™ are trademarks.
