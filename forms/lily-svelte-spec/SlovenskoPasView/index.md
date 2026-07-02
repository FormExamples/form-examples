# SlovenskoPasView

A headless read-only display for Slovakia's Pas. Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="slovensko-pas-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Slovakia Pas read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `SlovenskoPasInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.slovensko-pas-view`.

## References

- https://en.wikipedia.org/wiki/Slovak_passport
