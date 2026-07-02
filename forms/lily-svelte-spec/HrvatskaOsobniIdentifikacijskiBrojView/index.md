# HrvatskaOsobniIdentifikacijskiBrojView

A headless read-only display for Croatia's Osobni identifikacijski broj (OIB). Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="hrvatska-osobni-identifikacijski-broj-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Croatia Osobni identifikacijski broj read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `HrvatskaOsobniIdentifikacijskiBrojInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.hrvatska-osobni-identifikacijski-broj-view`.

## References

- https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)
